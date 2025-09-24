"""
Conversational Core Service

A FastAPI service for managing AI conversations and chat interactions.
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator
from loguru import logger
import redis.asyncio as redis
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response

# Prometheus metrics
REQUEST_COUNT = Counter('conversational_core_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('conversational_core_request_duration_seconds', 'Request duration')
CONVERSATION_COUNT = Counter('conversational_core_conversations_total', 'Total conversations')

# Security
security = HTTPBearer()

# Redis connection
redis_client: Optional[redis.Redis] = None

# Pydantic models
class Message(BaseModel):
    """Message model for conversation"""
    id: str = Field(..., description="Unique message ID")
    content: str = Field(..., min_length=1, max_length=4000, description="Message content")
    role: str = Field(..., regex="^(user|assistant|system)$", description="Message role")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class Conversation(BaseModel):
    """Conversation model"""
    id: str = Field(..., description="Unique conversation ID")
    title: str = Field(..., min_length=1, max_length=200, description="Conversation title")
    messages: List[Message] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ConversationCreate(BaseModel):
    """Model for creating a new conversation"""
    title: str = Field(..., min_length=1, max_length=200)
    initial_message: Optional[str] = Field(None, max_length=4000)

class ConversationUpdate(BaseModel):
    """Model for updating a conversation"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    metadata: Optional[Dict[str, Any]] = None

class MessageCreate(BaseModel):
    """Model for creating a new message"""
    content: str = Field(..., min_length=1, max_length=4000)
    role: str = Field(..., regex="^(user|assistant|system)$")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

# Dependency functions
async def get_redis() -> redis.Redis:
    """Get Redis client"""
    if redis_client is None:
        raise HTTPException(status_code=503, detail="Redis not available")
    return redis_client

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user from JWT token"""
    # In production, implement proper JWT validation
    return "user_123"  # Placeholder

# Lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global redis_client
    
    # Startup
    logger.info("Starting Conversational Core Service")
    try:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        redis_client = redis.from_url(redis_url, decode_responses=True)
        await redis_client.ping()
        logger.info("Connected to Redis")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        redis_client = None
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()
        logger.info("Disconnected from Redis")

# FastAPI app
app = FastAPI(
    title="Conversational Core Service",
    description="AI-powered conversation management service",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
)

# Routes
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "conversational-core", "timestamp": datetime.now(timezone.utc)}

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/conversations", response_model=Conversation)
async def create_conversation(
    conversation_data: ConversationCreate,
    background_tasks: BackgroundTasks,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Create a new conversation"""
    REQUEST_COUNT.labels(method="POST", endpoint="/conversations").inc()
    
    with REQUEST_DURATION.time():
        conversation_id = f"conv_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{current_user}"
        
        conversation = Conversation(
            id=conversation_id,
            title=conversation_data.title,
            messages=[],
            metadata={"user_id": current_user}
        )
        
        # Add initial message if provided
        if conversation_data.initial_message:
            message = Message(
                id=f"msg_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                content=conversation_data.initial_message,
                role="user"
            )
            conversation.messages.append(message)
        
        # Store in Redis
        await redis_client.hset(
            f"conversation:{conversation_id}",
            mapping={"data": conversation.json()}
        )
        
        # Update user's conversation list
        await redis_client.sadd(f"user:{current_user}:conversations", conversation_id)
        
        # Background task for analytics
        background_tasks.add_task(log_conversation_creation, conversation_id, current_user)
        
        CONVERSATION_COUNT.inc()
        logger.info(f"Created conversation {conversation_id} for user {current_user}")
        
        return conversation

@app.get("/conversations", response_model=List[Conversation])
async def list_conversations(
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """List user's conversations"""
    REQUEST_COUNT.labels(method="GET", endpoint="/conversations").inc()
    
    with REQUEST_DURATION.time():
        conversation_ids = await redis_client.smembers(f"user:{current_user}:conversations")
        conversations = []
        
        for conv_id in conversation_ids:
            conv_data = await redis_client.hget(f"conversation:{conv_id}", "data")
            if conv_data:
                conversations.append(Conversation.parse_raw(conv_data))
        
        # Sort by updated_at descending
        conversations.sort(key=lambda x: x.updated_at, reverse=True)
        
        return conversations

@app.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(
    conversation_id: str,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Get a specific conversation"""
    REQUEST_COUNT.labels(method="GET", endpoint="/conversations/{conversation_id}").inc()
    
    with REQUEST_DURATION.time():
        # Check if user has access to this conversation
        if not await redis_client.sismember(f"user:{current_user}:conversations", conversation_id):
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        conv_data = await redis_client.hget(f"conversation:{conversation_id}", "data")
        if not conv_data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return Conversation.parse_raw(conv_data)

@app.post("/conversations/{conversation_id}/messages", response_model=Message)
async def add_message(
    conversation_id: str,
    message_data: MessageCreate,
    background_tasks: BackgroundTasks,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Add a message to a conversation"""
    REQUEST_COUNT.labels(method="POST", endpoint="/conversations/{conversation_id}/messages").inc()
    
    with REQUEST_DURATION.time():
        # Check if user has access to this conversation
        if not await redis_client.sismember(f"user:{current_user}:conversations", conversation_id):
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get conversation
        conv_data = await redis_client.hget(f"conversation:{conversation_id}", "data")
        if not conv_data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        conversation = Conversation.parse_raw(conv_data)
        
        # Create new message
        message = Message(
            id=f"msg_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}",
            content=message_data.content,
            role=message_data.role,
            metadata=message_data.metadata
        )
        
        # Add message to conversation
        conversation.messages.append(message)
        conversation.updated_at = datetime.now(timezone.utc)
        
        # Update in Redis
        await redis_client.hset(
            f"conversation:{conversation_id}",
            mapping={"data": conversation.json()}
        )
        
        # Background task for AI processing
        if message_data.role == "user":
            background_tasks.add_task(process_user_message, conversation_id, message.id)
        
        logger.info(f"Added message {message.id} to conversation {conversation_id}")
        
        return message

# Background tasks
async def log_conversation_creation(conversation_id: str, user_id: str):
    """Log conversation creation for analytics"""
    logger.info(f"Conversation {conversation_id} created by user {user_id}")

async def process_user_message(conversation_id: str, message_id: str):
    """Process user message and generate AI response"""
    # In production, integrate with AI service
    logger.info(f"Processing user message {message_id} in conversation {conversation_id}")
    
    # Simulate AI processing
    await asyncio.sleep(1)
    
    # Generate AI response (placeholder)
    ai_response = "This is a placeholder AI response. In production, this would be generated by your AI service."
    
    # Add AI response to conversation
    if redis_client:
        conv_data = await redis_client.hget(f"conversation:{conversation_id}", "data")
        if conv_data:
            conversation = Conversation.parse_raw(conv_data)
            
            ai_message = Message(
                id=f"msg_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}",
                content=ai_response,
                role="assistant"
            )
            
            conversation.messages.append(ai_message)
            conversation.updated_at = datetime.now(timezone.utc)
            
            await redis_client.hset(
                f"conversation:{conversation_id}",
                mapping={"data": conversation.json()}
            )
            
            logger.info(f"Added AI response to conversation {conversation_id}")

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )

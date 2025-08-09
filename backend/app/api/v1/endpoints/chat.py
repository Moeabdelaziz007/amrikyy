"""
Chat API endpoints for conversation management and RAG queries
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import structlog

from app.core.database import get_db
from app.models.schemas import (
    QueryRequest, 
    QueryResponse, 
    ConversationResponse,
    ConversationCreate
)
from app.services.chat_service import ChatService
from app.services.rag_service import RAGService
from app.core.exceptions import ValidationError, NotFoundError

logger = structlog.get_logger()
router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query_chat(
    request: QueryRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends(),
    rag_service: RAGService = Depends()
):
    """
    Process a chat query using RAG pipeline
    
    This endpoint:
    1. Retrieves relevant documents using vector search
    2. Reranks results for better relevance
    3. Generates response using LLM with retrieved context
    4. Returns response with source citations
    """
    try:
        logger.info("Processing chat query", query=request.message[:100])
        
        # Validate input
        if not request.message.strip():
            raise ValidationError("Message cannot be empty", "message")
        
        if len(request.message) > 10000:
            raise ValidationError("Message too long", "message")
        
        # Process the query through enhanced RAG pipeline with memory
        response = await rag_service.process_query(
            query=request.message,
            conversation_id=request.conversation_id,
            options=request.options,
            user_id=getattr(request, 'user_id', 'anonymous')
        )
        
        # Save conversation asynchronously
        if request.conversation_id:
            background_tasks.add_task(
                chat_service.add_message_to_conversation,
                request.conversation_id,
                request.message,
                response.content
            )
        
        logger.info("Chat query processed successfully", response_id=response.id)
        return response
        
    except ValidationError:
        raise
    except Exception as e:
        logger.error("Failed to process chat query", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to process query")

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends()
):
    """Get user conversations"""
    try:
        conversations = await chat_service.get_conversations(
            limit=limit, 
            offset=offset
        )
        return conversations
    except Exception as e:
        logger.error("Failed to get conversations", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve conversations")

@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends()
):
    """Create a new conversation"""
    try:
        new_conversation = await chat_service.create_conversation(conversation)
        logger.info("Conversation created", conversation_id=new_conversation.id)
        return new_conversation
    except Exception as e:
        logger.error("Failed to create conversation", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to create conversation")

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends()
):
    """Get a specific conversation"""
    try:
        conversation = await chat_service.get_conversation(conversation_id)
        if not conversation:
            raise NotFoundError("Conversation not found", "conversation")
        return conversation
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Failed to get conversation", error=str(e), conversation_id=conversation_id)
        raise HTTPException(status_code=500, detail="Failed to retrieve conversation")

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends()
):
    """Delete a conversation"""
    try:
        await chat_service.delete_conversation(conversation_id)
        logger.info("Conversation deleted", conversation_id=conversation_id)
        return {"message": "Conversation deleted successfully"}
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Failed to delete conversation", error=str(e), conversation_id=conversation_id)
        raise HTTPException(status_code=500, detail="Failed to delete conversation")

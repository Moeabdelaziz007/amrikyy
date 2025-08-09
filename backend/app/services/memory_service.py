"""
Enhanced Memory Service for Chatbot
Provides long-term memory, context awareness, and personalized responses
"""

import json
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from pathlib import Path
import structlog
from collections import defaultdict, deque

from app.core.config import settings
from app.services.embedding_service import EmbeddingService
from app.core.exceptions import MemoryError

logger = structlog.get_logger()

@dataclass
class MemoryItem:
    id: str
    content: str
    category: str
    tags: List[str]
    timestamp: datetime
    importance: float = 1.0
    access_count: int = 0
    last_accessed: Optional[datetime] = None
    metadata: Dict[str, Any] = None
    embedding: Optional[List[float]] = None

@dataclass
class ConversationContext:
    user_id: str
    session_id: str
    messages: List[Dict[str, Any]]
    topics: List[str]
    user_preferences: Dict[str, Any]
    created_at: datetime
    last_activity: datetime

class MemoryService:
    """Enhanced memory service with context awareness and learning capabilities"""
    
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.memory_items: Dict[str, MemoryItem] = {}
        self.conversation_contexts: Dict[str, ConversationContext] = {}
        self.user_preferences: Dict[str, Dict[str, Any]] = defaultdict(dict)
        
        # Memory configuration
        self.max_conversation_history = 50
        self.memory_decay_days = 30
        self.importance_threshold = 0.3
        
        # Load datasets
        self._load_base_memory()
        
    async def initialize(self):
        """Initialize the memory service and load embeddings"""
        logger.info("Initializing memory service...")
        await self._generate_embeddings_for_memory()
        logger.info("Memory service initialized successfully")
    
    def _load_base_memory(self):
        """Load base memory dataset from JSON files"""
        try:
            # Load Amrikyy personal memory
            memory_file = Path(settings.BASE_DIR) / "data" / "amrikyy_memory_dataset.json"
            if memory_file.exists():
                with open(memory_file, 'r', encoding='utf-8') as f:
                    memory_data = json.load(f)
                    
                for item_data in memory_data:
                    memory_item = MemoryItem(
                        id=item_data['id'],
                        content=item_data['content'],
                        category=item_data['category'],
                        tags=item_data['tags'],
                        timestamp=datetime.fromisoformat(
                            item_data.get('metadata', {}).get('freshness', datetime.utcnow().isoformat())
                        ),
                        importance=self._calculate_importance(item_data),
                        metadata=item_data.get('metadata', {})
                    )
                    self.memory_items[memory_item.id] = memory_item
            
            # Load coding expertise
            coding_file = Path(settings.BASE_DIR) / "data" / "coding_expertise_dataset.json"
            if coding_file.exists():
                with open(coding_file, 'r', encoding='utf-8') as f:
                    coding_data = json.load(f)
                    
                for item_data in coding_data:
                    memory_item = MemoryItem(
                        id=f"coding-{item_data['id']}",
                        content=item_data['content'],
                        category="coding",
                        tags=item_data.get('tags', []),
                        timestamp=datetime.utcnow(),
                        importance=0.8,  # High importance for technical content
                        metadata={"difficulty": item_data.get('difficulty', 'medium')}
                    )
                    self.memory_items[memory_item.id] = memory_item
            
            # Load advanced programming patterns
            patterns_file = Path(settings.BASE_DIR) / "data" / "advanced_programming_patterns.json"
            if patterns_file.exists():
                with open(patterns_file, 'r', encoding='utf-8') as f:
                    patterns_data = json.load(f)
                    
                for item_data in patterns_data:
                    memory_item = MemoryItem(
                        id=f"pattern-{item_data['id']}",
                        content=item_data['content'],
                        category="patterns",
                        tags=item_data.get('tags', []),
                        timestamp=datetime.utcnow(),
                        importance=0.9,  # Very high importance for advanced patterns
                        metadata={
                            "difficulty": item_data.get('difficulty', 'advanced'),
                            "language": item_data.get('language', 'python')
                        }
                    )
                    self.memory_items[memory_item.id] = memory_item
                    
            logger.info(f"Loaded {len(self.memory_items)} memory items")
            
        except Exception as e:
            logger.error(f"Failed to load base memory: {e}")
            raise MemoryError(f"Failed to load memory datasets: {e}")
    
    def _calculate_importance(self, item_data: Dict[str, Any]) -> float:
        """Calculate importance score based on metadata"""
        base_importance = 0.5
        metadata = item_data.get('metadata', {})
        
        # Boost for high importance items
        if metadata.get('importance') == 'high':
            base_importance += 0.4
        elif metadata.get('importance') == 'medium':
            base_importance += 0.2
        
        # Boost for verified information
        if metadata.get('verified', False):
            base_importance += 0.1
        
        # Boost for fresh information
        freshness = metadata.get('freshness')
        if freshness:
            try:
                fresh_date = datetime.fromisoformat(freshness)
                days_old = (datetime.utcnow() - fresh_date).days
                if days_old < 7:
                    base_importance += 0.2
                elif days_old < 30:
                    base_importance += 0.1
            except:
                pass
        
        return min(base_importance, 1.0)
    
    async def _generate_embeddings_for_memory(self):
        """Generate embeddings for all memory items"""
        items_without_embeddings = [
            item for item in self.memory_items.values() 
            if item.embedding is None
        ]
        
        if not items_without_embeddings:
            return
        
        logger.info(f"Generating embeddings for {len(items_without_embeddings)} memory items")
        
        # Batch process embeddings
        batch_size = 10
        for i in range(0, len(items_without_embeddings), batch_size):
            batch = items_without_embeddings[i:i + batch_size]
            
            tasks = []
            for item in batch:
                tasks.append(self._generate_item_embedding(item))
            
            await asyncio.gather(*tasks)
            
            # Small delay to avoid rate limits
            await asyncio.sleep(0.1)
    
    async def _generate_item_embedding(self, item: MemoryItem):
        """Generate embedding for a single memory item"""
        try:
            # Combine content and metadata for embedding
            text_for_embedding = f"{item.content}\nCategory: {item.category}\nTags: {', '.join(item.tags)}"
            
            embedding = await self.embedding_service.embed_query(text_for_embedding)
            item.embedding = embedding
            
        except Exception as e:
            logger.warning(f"Failed to generate embedding for item {item.id}: {e}")
    
    async def search_memory(
        self,
        query: str,
        categories: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        top_k: int = 5,
        min_similarity: float = 0.7
    ) -> List[MemoryItem]:
        """Search memory using semantic similarity"""
        try:
            # Generate query embedding
            query_embedding = await self.embedding_service.embed_query(query)
            
            # Filter candidates
            candidates = list(self.memory_items.values())
            
            if categories:
                candidates = [item for item in candidates if item.category in categories]
            
            if tags:
                candidates = [
                    item for item in candidates 
                    if any(tag in item.tags for tag in tags)
                ]
            
            # Calculate similarities
            similarities = []
            for item in candidates:
                if item.embedding is None:
                    await self._generate_item_embedding(item)
                
                if item.embedding:
                    similarity = self._cosine_similarity(query_embedding, item.embedding)
                    if similarity >= min_similarity:
                        similarities.append((similarity, item))
            
            # Sort by similarity and importance
            similarities.sort(key=lambda x: (x[0], x[1].importance), reverse=True)
            
            # Update access statistics
            results = []
            for similarity, item in similarities[:top_k]:
                item.access_count += 1
                item.last_accessed = datetime.utcnow()
                results.append(item)
            
            return results
            
        except Exception as e:
            logger.error(f"Failed to search memory: {e}")
            return []
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        import math
        
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = math.sqrt(sum(a * a for a in vec1))
        magnitude2 = math.sqrt(sum(a * a for a in vec2))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0
        
        return dot_product / (magnitude1 * magnitude2)
    
    async def add_conversation_memory(
        self,
        user_id: str,
        session_id: str,
        user_message: str,
        assistant_response: str,
        topics: Optional[List[str]] = None
    ):
        """Add conversation to memory for context"""
        try:
            context_key = f"{user_id}:{session_id}"
            
            if context_key not in self.conversation_contexts:
                self.conversation_contexts[context_key] = ConversationContext(
                    user_id=user_id,
                    session_id=session_id,
                    messages=[],
                    topics=topics or [],
                    user_preferences={},
                    created_at=datetime.utcnow(),
                    last_activity=datetime.utcnow()
                )
            
            context = self.conversation_contexts[context_key]
            
            # Add messages
            context.messages.extend([
                {
                    "role": "user",
                    "content": user_message,
                    "timestamp": datetime.utcnow().isoformat()
                },
                {
                    "role": "assistant", 
                    "content": assistant_response,
                    "timestamp": datetime.utcnow().isoformat()
                }
            ])
            
            # Maintain conversation history limit
            if len(context.messages) > self.max_conversation_history:
                context.messages = context.messages[-self.max_conversation_history:]
            
            # Update topics
            if topics:
                context.topics.extend(topics)
                context.topics = list(set(context.topics))  # Remove duplicates
            
            context.last_activity = datetime.utcnow()
            
            # Extract and store user preferences
            await self._extract_user_preferences(user_id, user_message)
            
        except Exception as e:
            logger.error(f"Failed to add conversation memory: {e}")
    
    async def _extract_user_preferences(self, user_id: str, message: str):
        """Extract user preferences from messages"""
        # Simple keyword-based preference extraction
        # In a real system, this could use NLP to extract more sophisticated preferences
        
        preferences = self.user_preferences[user_id]
        
        # Language preference
        if any(arabic_char in message for arabic_char in 'أإآابتثجحخدذرزسشصضطظعغفقكلمنهوي'):
            preferences['preferred_language'] = 'ar'
        elif message.strip() and all(ord(char) < 128 for char in message if char.isalpha()):
            preferences['preferred_language'] = 'en'
        
        # Technical interest areas
        tech_keywords = {
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'ذكاء اصطناعي'],
            'cybersecurity': ['security', 'cybersecurity', 'أمن', 'أمان'],
            'web': ['web', 'website', 'react', 'javascript', 'ويب'],
            'crypto': ['crypto', 'cryptocurrency', 'bitcoin', 'عملة مشفرة']
        }
        
        for topic, keywords in tech_keywords.items():
            if any(keyword.lower() in message.lower() for keyword in keywords):
                if 'interests' not in preferences:
                    preferences['interests'] = []
                if topic not in preferences['interests']:
                    preferences['interests'].append(topic)
    
    async def get_conversation_context(
        self,
        user_id: str,
        session_id: str,
        max_messages: int = 10
    ) -> Optional[ConversationContext]:
        """Get conversation context for a user session"""
        context_key = f"{user_id}:{session_id}"
        context = self.conversation_contexts.get(context_key)
        
        if context:
            # Return recent messages only
            recent_context = ConversationContext(
                user_id=context.user_id,
                session_id=context.session_id,
                messages=context.messages[-max_messages:] if context.messages else [],
                topics=context.topics,
                user_preferences=context.user_preferences,
                created_at=context.created_at,
                last_activity=context.last_activity
            )
            return recent_context
        
        return None
    
    async def get_personalized_context(
        self,
        query: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get personalized context for generating responses"""
        context = {
            "relevant_memories": [],
            "conversation_history": [],
            "user_preferences": {},
            "topics": []
        }
        
        try:
            # Search relevant memories
            memories = await self.search_memory(query, top_k=3)
            context["relevant_memories"] = [
                {
                    "content": memory.content,
                    "category": memory.category,
                    "importance": memory.importance
                }
                for memory in memories
            ]
            
            # Get conversation context if available
            if user_id and session_id:
                conv_context = await self.get_conversation_context(user_id, session_id)
                if conv_context:
                    context["conversation_history"] = conv_context.messages[-5:]  # Last 5 messages
                    context["topics"] = conv_context.topics
                    context["user_preferences"] = conv_context.user_preferences
            
            # Get user preferences
            if user_id:
                context["user_preferences"] = self.user_preferences.get(user_id, {})
            
        except Exception as e:
            logger.error(f"Failed to get personalized context: {e}")
        
        return context
    
    async def add_dynamic_memory(
        self,
        content: str,
        category: str,
        tags: List[str],
        importance: float = 0.5,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Add new memory item dynamically"""
        memory_id = f"dynamic-{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}"
        
        memory_item = MemoryItem(
            id=memory_id,
            content=content,
            category=category,
            tags=tags,
            timestamp=datetime.utcnow(),
            importance=importance,
            metadata=metadata or {}
        )
        
        # Generate embedding
        await self._generate_item_embedding(memory_item)
        
        self.memory_items[memory_id] = memory_item
        
        logger.info(f"Added dynamic memory item: {memory_id}")
        return memory_id
    
    async def update_memory_importance(self, memory_id: str, importance_delta: float):
        """Update memory importance based on usage patterns"""
        if memory_id in self.memory_items:
            item = self.memory_items[memory_id]
            item.importance = max(0.0, min(1.0, item.importance + importance_delta))
    
    async def cleanup_old_memories(self):
        """Clean up old, low-importance memories"""
        cutoff_date = datetime.utcnow() - timedelta(days=self.memory_decay_days)
        
        items_to_remove = []
        for memory_id, item in self.memory_items.items():
            if (item.timestamp < cutoff_date and 
                item.importance < self.importance_threshold and
                not item.metadata.get('permanent', False)):
                items_to_remove.append(memory_id)
        
        for memory_id in items_to_remove:
            del self.memory_items[memory_id]
        
        if items_to_remove:
            logger.info(f"Cleaned up {len(items_to_remove)} old memory items")
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory system statistics"""
        categories = defaultdict(int)
        total_access_count = 0
        
        for item in self.memory_items.values():
            categories[item.category] += 1
            total_access_count += item.access_count
        
        return {
            "total_memories": len(self.memory_items),
            "categories": dict(categories),
            "total_access_count": total_access_count,
            "active_conversations": len(self.conversation_contexts),
            "user_preferences": len(self.user_preferences)
        }

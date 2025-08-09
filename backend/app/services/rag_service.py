"""
RAG Service - Core RAG pipeline implementation
"""

from typing import List, Optional
import structlog
from datetime import datetime
import hashlib
import asyncio

from app.core.config import settings
from app.models.schemas import QueryRequest, QueryResponse, Source, QueryOptions
from app.services.retrieval_service import RetrievalService
from app.services.llm_service import LLMService
from app.services.embedding_service import EmbeddingService
from app.services.memory_service import MemoryService
from app.core.exceptions import RetrievalError, LLMError

logger = structlog.get_logger()

class RAGService:
    """RAG pipeline orchestrator"""
    
    def __init__(self):
        self.retrieval_service = RetrievalService()
        self.llm_service = LLMService()
        self.embedding_service = EmbeddingService()
        self.memory_service = MemoryService()
        self._memory_initialized = False
    
    async def process_query(
        self, 
        query: str, 
        conversation_id: Optional[str] = None,
        options: Optional[QueryOptions] = None,
        user_id: Optional[str] = None
    ) -> QueryResponse:
        """
        Process a query through the enhanced RAG pipeline with memory
        
        Steps:
        1. Initialize memory if needed
        2. Get personalized context from memory
        3. Generate query embedding
        4. Retrieve relevant documents
        5. Search memory for relevant information
        6. Rerank and combine results
        7. Build enhanced context
        8. Generate personalized response
        9. Update memory with conversation
        """
        start_time = datetime.utcnow()
        
        if not options:
            options = QueryOptions()
        
        try:
            logger.info("Starting enhanced RAG pipeline", query=query[:100])
            
            # Step 1: Initialize memory service if needed
            if not self._memory_initialized:
                await self.memory_service.initialize()
                self._memory_initialized = True
            
            # Step 2: Get personalized context from memory
            memory_context = await self.memory_service.get_personalized_context(
                query=query,
                user_id=user_id,
                session_id=conversation_id
            )
            
            # Step 3: Generate query embedding
            query_embedding = await self.embedding_service.embed_query(query)
            
            # Step 4: Retrieve relevant documents from knowledge base
            retrieved_docs = await self.retrieval_service.retrieve(
                query_embedding=query_embedding,
                query_text=query,
                top_k=options.top_k or settings.RETRIEVAL_TOP_K
            )
            
            logger.info("Retrieved documents", count=len(retrieved_docs))
            
            # Step 5: Search memory for relevant information
            memory_items = await self.memory_service.search_memory(
                query=query,
                top_k=3,
                min_similarity=0.6
            )
            
            logger.info("Retrieved memory items", count=len(memory_items))
            
            # Step 6: Rerank documents if we have results
            if retrieved_docs:
                reranked_docs = await self.retrieval_service.rerank(
                    query=query,
                    documents=retrieved_docs,
                    top_k=options.top_k or settings.RERANK_TOP_K
                )
            else:
                reranked_docs = []
            
            # Step 7: Build enhanced context with memory
            context = self._build_enhanced_context(reranked_docs, memory_items, memory_context)
            prompt = self._build_enhanced_prompt(query, context, memory_context)
            
            # Step 8: Generate personalized response
            response_content = await self.llm_service.generate_personalized_response(
                query=query,
                retrieved_context=context,
                conversation_history=memory_context.get("conversation_history", [])
            )
            
            # Step 9: Extract sources and create response
            sources = self._extract_sources(reranked_docs, memory_items)
            
            # Step 10: Update memory with conversation
            if user_id and conversation_id:
                await self.memory_service.add_conversation_memory(
                    user_id=user_id,
                    session_id=conversation_id,
                    user_message=query,
                    assistant_response=response_content
                )
            
            # Calculate processing time
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            
            # Create enhanced response
            response = QueryResponse(
                id=self._generate_response_id(query, response_content),
                content=response_content,
                sources=sources if options.sources else None,
                conversation_id=conversation_id or self._generate_conversation_id(),
                timestamp=datetime.utcnow(),
                model_used=options.model or settings.OPENAI_MODEL,
                processing_time=processing_time
            )
            
            logger.info("Enhanced RAG pipeline completed", 
                       response_id=response.id, 
                       processing_time=processing_time,
                       sources_count=len(sources),
                       memory_items_count=len(memory_items))
            
            return response
            
        except Exception as e:
            logger.error("Enhanced RAG pipeline failed", error=str(e), query=query[:100])
            raise LLMError(f"Failed to process query: {str(e)}")
    
    def _build_context(self, documents: List[dict]) -> str:
        """Build context string from retrieved documents"""
        if not documents:
            return ""
        
        context_parts = []
        for i, doc in enumerate(documents, 1):
            source_info = f"===SOURCE {i}==="
            metadata = f"metadata: {doc.get('metadata', {})}"
            passage = f"passage: \"{doc['content']}\""
            end_marker = f"===END SOURCE {i}==="
            
            context_parts.append(f"{source_info}\n{metadata}\n{passage}\n{end_marker}")
        
        return "\n\n".join(context_parts)
    
    def _build_prompt(self, query: str, context: str) -> str:
        """Build the complete prompt for the LLM"""
        system_prompt = """System: You are Amrikyy AI — an expert, concise, and careful assistant. ALWAYS follow these rules:
1) When the user asks a factual or document-related question, first consult the provided SOURCES. Use only the information contained in those sources to answer factual claims.
2) For each factual claim, include one or more bracketed citations like [Source 1] referencing the labelled retrieved passages. After the main answer, include a "Sources" list with full metadata and a short quoted snippet for each cited source.
3) If the retrieved sources do not support the answer, do NOT fabricate. Say "I could not find a supporting source in the provided documents." Offer to search more sources or ask clarifying questions.
4) If asked for opinion or synthesis beyond the sources, label your answer clearly as "Opinion:" and separate model knowledge from source-based facts.
5) Keep responses concise (2-6 sentences) by default unless the user requests detail. Offer "more details" as an expandable option.
6) Respect user privacy and do not disclose private or restricted content unless the user has explicit rights.
7) If the user asks for the raw retrieved passages, show them in the "Retrieved Passages" block unchanged and cite them.

Respond in Arabic when appropriate, and always maintain a helpful and professional tone."""

        if context:
            full_prompt = f"{system_prompt}\n\n{context}\n\nINSTRUCTION: Answer using the retrieved sources. For each factual claim cite the source(s) like [Source 1]. If no supporting source: 'No source found.'\n\nUser Question: {query}\n\nAssistant:"
        else:
            full_prompt = f"{system_prompt}\n\nNo relevant sources were found in the knowledge base. Please provide a helpful response based on general knowledge while noting the lack of specific sources.\n\nUser Question: {query}\n\nAssistant:"
        
        return full_prompt
    
    def _build_enhanced_context(self, documents: List[dict], memory_items: List, memory_context: dict) -> str:
        """Build enhanced context from documents, memory, and conversation history"""
        context_parts = []
        
        # Add memory-based context first (most personalized)
        if memory_items:
            context_parts.append("=== PERSONAL KNOWLEDGE ===")
            for i, memory in enumerate(memory_items, 1):
                context_parts.append(f"Memory {i}:")
                context_parts.append(f"Category: {memory.category}")
                context_parts.append(f"Content: {memory.content}")
                context_parts.append(f"Importance: {memory.importance}")
                context_parts.append("")
        
        # Add retrieved documents
        if documents:
            context_parts.append("=== RETRIEVED DOCUMENTS ===")
            for i, doc in enumerate(documents, 1):
                source_info = f"===SOURCE {i}==="
                metadata = f"metadata: {doc.get('metadata', {})}"
                passage = f"passage: \"{doc['content']}\""
                end_marker = f"===END SOURCE {i}==="
                
                context_parts.append(f"{source_info}\n{metadata}\n{passage}\n{end_marker}")
        
        # Add conversation context
        if memory_context.get("conversation_history"):
            context_parts.append("=== CONVERSATION HISTORY ===")
            for msg in memory_context["conversation_history"][-3:]:  # Last 3 messages
                role = "User" if msg.get("role") == "user" else "Assistant"
                context_parts.append(f"{role}: {msg.get('content', '')}")
        
        return "\n\n".join(context_parts)
    
    def _build_enhanced_prompt(self, query: str, context: str, memory_context: dict) -> str:
        """Build enhanced prompt with memory context"""
        user_prefs = memory_context.get("user_preferences", {})
        preferred_lang = user_prefs.get("preferred_language", "ar")
        interests = user_prefs.get("interests", [])
        
        system_prompt = f"""أنت Amrikyy AI - مساعد ذكي متخصص ومطور. اتبع هذه القواعد دائماً:

1) عندما يسأل المستخدم سؤالاً واقعياً، استشر المعرفة الشخصية والمصادر المسترجعة أولاً
2) لكل ادعاء واقعي، أدرج مراجع بين أقواس مربعة مثل [المصدر 1] أو [الذاكرة الشخصية]
3) إذا لم تدعم المصادر الإجابة، لا تختلق معلومات. قل "لم أجد مصدر داعم"
4) اجعل إجاباتك طبيعية ومفيدة مع الحفاظ على شخصيتي الودودة والمهنية
5) استخدم العربية كلغة أساسية ما لم يُطلب غير ذلك

معلومات شخصية: أنا محمد عبدالعزيز (Amrikyy)، مهندس أمن سيبراني ومطور ذكاء اصطناعي."""

        if interests:
            system_prompt += f"\nاهتمامات المستخدم: {', '.join(interests)}"
        
        if context:
            full_prompt = f"{system_prompt}\n\n{context}\n\nINSTRUCTION: أجب باستخدام المعرفة الشخصية والمصادر المسترجعة. لكل ادعاء واقعي، اذكر المصدر.\n\nسؤال المستخدم: {query}\n\nAmrikyy:"
        else:
            full_prompt = f"{system_prompt}\n\nلم يتم العثور على مصادر ذات صلة في قاعدة المعرفة. أجب بناءً على معرفتي الشخصية مع الإشارة لعدم وجود مصادر محددة.\n\nسؤال المستخدم: {query}\n\nAmrikyy:"
        
        return full_prompt
    
    def _extract_sources(self, documents: List[dict], memory_items: List = None) -> List[Source]:
        """Extract sources from retrieved documents and memory items"""
        sources = []
        
        # Add document sources
        for i, doc in enumerate(documents, 1):
            source = Source(
                id=doc.get('id', f'source_{i}'),
                title=doc.get('title', 'Unknown Document'),
                snippet=doc.get('content', '')[:500] + ('...' if len(doc.get('content', '')) > 500 else ''),
                url=doc.get('url'),
                timestamp=doc.get('timestamp'),
                confidence=doc.get('confidence'),
                metadata=doc.get('metadata')
            )
            sources.append(source)
        
        # Add memory sources
        if memory_items:
            for i, memory in enumerate(memory_items, 1):
                source = Source(
                    id=memory.id,
                    title=f"Personal Knowledge - {memory.category.title()}",
                    snippet=memory.content[:500] + ('...' if len(memory.content) > 500 else ''),
                    url=None,
                    timestamp=memory.timestamp,
                    confidence=memory.importance,
                    metadata={
                        "type": "memory",
                        "category": memory.category,
                        "tags": memory.tags,
                        "access_count": memory.access_count
                    }
                )
                sources.append(source)
        
        return sources
    
    def _generate_response_id(self, query: str, response: str) -> str:
        """Generate a unique response ID"""
        content = f"{query}:{response}:{datetime.utcnow().isoformat()}"
        return hashlib.md5(content.encode()).hexdigest()[:16]
    
    def _generate_conversation_id(self) -> str:
        """Generate a new conversation ID"""
        content = f"conv:{datetime.utcnow().isoformat()}"
        return hashlib.md5(content.encode()).hexdigest()[:16]

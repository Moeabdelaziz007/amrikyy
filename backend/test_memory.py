#!/usr/bin/env python3
"""
Simple test script for memory-enhanced chatbot
"""

import asyncio
import json
from pathlib import Path
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

# Mock the required services for testing
class MockEmbeddingService:
    async def embed_query(self, text: str):
        # Simple mock embedding - in reality this would call OpenAI
        return [0.1] * 1536  # Mock 1536-dimensional vector

class MockRetrievalService:
    async def retrieve(self, query_embedding, query_text, top_k=5):
        return []  # Mock empty retrieval
    
    async def rerank(self, query, documents, top_k=5):
        return documents

# Test the memory system
async def test_memory_system():
    print("🧠 Testing Enhanced Memory System...")
    
    try:
        # Import memory service
        from app.services.memory_service import MemoryService
        
        # Mock embedding service
        memory_service = MemoryService()
        memory_service.embedding_service = MockEmbeddingService()
        
        # Test 1: Load base memory
        print("📋 Test 1: Loading base memory dataset...")
        print(f"   Loaded {len(memory_service.memory_items)} memory items")
        
        # Show categories
        categories = {}
        for item in memory_service.memory_items.values():
            categories[item.category] = categories.get(item.category, 0) + 1
        
        print("   Categories loaded:")
        for category, count in categories.items():
            print(f"     - {category}: {count} items")
        
        # Test 2: Initialize embeddings
        print("\n🔍 Test 2: Initializing embeddings...")
        await memory_service.initialize()
        print("   ✅ Embeddings initialized successfully")
        
        # Test 3: Search memory
        print("\n🔎 Test 3: Testing memory search...")
        test_queries = [
            "من هو محمد عبدالعزيز؟",
            "ما هي خبرتك في الذكاء الاصطناعي؟",
            "كيف يمكنني التواصل معك؟",
            "What are your programming skills?",
            "Tell me about your projects"
        ]
        
        for query in test_queries:
            print(f"\n   Query: {query}")
            results = await memory_service.search_memory(query, top_k=2, min_similarity=0.5)
            print(f"   Found {len(results)} relevant memories:")
            
            for i, memory in enumerate(results, 1):
                print(f"     {i}. Category: {memory.category}")
                print(f"        Content preview: {memory.content[:100]}...")
                print(f"        Importance: {memory.importance:.2f}")
        
        # Test 4: Add conversation memory
        print("\n💬 Test 4: Testing conversation memory...")
        await memory_service.add_conversation_memory(
            user_id="test_user",
            session_id="test_session",
            user_message="مرحبا، كيف حالك؟",
            assistant_response="أهلاً وسهلاً! أنا بخير، شكراً لك. كيف يمكنني مساعدتك اليوم؟",
            topics=["greeting", "assistance"]
        )
        print("   ✅ Conversation memory added successfully")
        
        # Test 5: Get personalized context
        print("\n🎯 Test 5: Testing personalized context...")
        context = await memory_service.get_personalized_context(
            query="أخبرني عن مشاريعك",
            user_id="test_user",
            session_id="test_session"
        )
        
        print(f"   Found {len(context['relevant_memories'])} relevant memories")
        print(f"   Conversation history: {len(context['conversation_history'])} messages")
        print(f"   User preferences: {context['user_preferences']}")
        
        # Test 6: Memory statistics
        print("\n📊 Test 6: Memory statistics...")
        stats = memory_service.get_memory_stats()
        print(f"   Total memories: {stats['total_memories']}")
        print(f"   Categories: {stats['categories']}")
        print(f"   Active conversations: {stats['active_conversations']}")
        
        print("\n🎉 All memory tests passed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Memory test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

# Test the RAG service integration
async def test_rag_integration():
    print("\n🤖 Testing RAG Service Integration...")
    
    try:
        # Mock the required services
        import app.services.rag_service as rag_module
        
        # Temporarily replace services with mocks
        original_retrieval = rag_module.RetrievalService
        original_embedding = rag_module.EmbeddingService
        
        rag_module.RetrievalService = MockRetrievalService
        rag_module.EmbeddingService = MockEmbeddingService
        
        from app.services.rag_service import RAGService
        
        rag_service = RAGService()
        
        # Mock the LLM service
        class MockLLMService:
            async def generate_personalized_response(self, query, retrieved_context="", conversation_history=None):
                return f"مرحبا! هذا رد تجريبي على سؤالك: {query}"
        
        rag_service.llm_service = MockLLMService()
        
        # Test enhanced query processing
        print("   Testing enhanced query processing...")
        
        # Mock query options
        from app.models.schemas import QueryOptions
        
        response = await rag_service.process_query(
            query="أخبرني عن نفسك",
            conversation_id="test_conversation",
            user_id="test_user"
        )
        
        print(f"   ✅ Response generated: {response.content[:100]}...")
        print(f"   Response ID: {response.id}")
        print(f"   Processing time: {response.processing_time:.3f}s")
        
        # Restore original services
        rag_module.RetrievalService = original_retrieval
        rag_module.EmbeddingService = original_embedding
        
        print("   🎉 RAG integration test passed!")
        return True
        
    except Exception as e:
        print(f"   ❌ RAG integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    print("🚀 Starting Enhanced Chatbot Memory Tests\n")
    
    # Mock settings
    class MockSettings:
        BASE_DIR = Path(__file__).parent
        OPENAI_API_KEY = "mock-key"
        MEMORY_MAX_ITEMS = 10000
        MEMORY_DECAY_DAYS = 30
        MEMORY_IMPORTANCE_THRESHOLD = 0.3
        CONVERSATION_HISTORY_LIMIT = 50
        RETRIEVAL_TOP_K = 10
        RERANK_TOP_K = 5
        OPENAI_TEMPERATURE = 0.7
        OPENAI_MAX_TOKENS = 1000
        OPENAI_MODEL = "gpt-4"
    
    import app.core.config as config_module
    config_module.settings = MockSettings()
    
    # Run tests
    memory_test = await test_memory_system()
    rag_test = await test_rag_integration()
    
    if memory_test and rag_test:
        print("\n✅ All tests passed! Enhanced chatbot memory system is ready.")
        return True
    else:
        print("\n❌ Some tests failed. Please check the implementation.")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)

"""
Memory API endpoints for memory management and statistics
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
import structlog

from app.services.rag_service import RAGService
from app.core.exceptions import MemoryError

logger = structlog.get_logger()
router = APIRouter()

@router.get("/stats")
async def get_memory_stats() -> Dict[str, Any]:
    """Get memory system statistics"""
    try:
        rag_service = RAGService()
        
        # Initialize memory if needed
        if not rag_service._memory_initialized:
            await rag_service.memory_service.initialize()
            rag_service._memory_initialized = True
        
        stats = rag_service.memory_service.get_memory_stats()
        
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        logger.error("Failed to get memory stats", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to get memory statistics")

@router.post("/cleanup")
async def cleanup_old_memories() -> Dict[str, Any]:
    """Clean up old, low-importance memories"""
    try:
        rag_service = RAGService()
        
        # Initialize memory if needed
        if not rag_service._memory_initialized:
            await rag_service.memory_service.initialize()
            rag_service._memory_initialized = True
        
        await rag_service.memory_service.cleanup_old_memories()
        
        return {
            "success": True,
            "message": "Memory cleanup completed successfully"
        }
        
    except Exception as e:
        logger.error("Failed to cleanup memories", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to cleanup memories")

@router.get("/search")
async def search_memory(
    query: str,
    categories: Optional[str] = None,
    tags: Optional[str] = None,
    top_k: int = 5,
    min_similarity: float = 0.7
) -> Dict[str, Any]:
    """Search memory using semantic similarity"""
    try:
        rag_service = RAGService()
        
        # Initialize memory if needed
        if not rag_service._memory_initialized:
            await rag_service.memory_service.initialize()
            rag_service._memory_initialized = True
        
        # Parse categories and tags
        category_list = categories.split(",") if categories else None
        tag_list = tags.split(",") if tags else None
        
        # Search memory
        memory_items = await rag_service.memory_service.search_memory(
            query=query,
            categories=category_list,
            tags=tag_list,
            top_k=top_k,
            min_similarity=min_similarity
        )
        
        # Format results
        results = []
        for item in memory_items:
            results.append({
                "id": item.id,
                "content": item.content[:200] + ("..." if len(item.content) > 200 else ""),
                "category": item.category,
                "tags": item.tags,
                "importance": item.importance,
                "access_count": item.access_count,
                "last_accessed": item.last_accessed.isoformat() if item.last_accessed else None,
                "timestamp": item.timestamp.isoformat()
            })
        
        return {
            "success": True,
            "query": query,
            "results": results,
            "count": len(results)
        }
        
    except Exception as e:
        logger.error("Failed to search memory", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to search memory")

@router.post("/add")
async def add_memory(
    content: str,
    category: str,
    tags: List[str],
    importance: float = 0.5,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Add new memory item dynamically"""
    try:
        rag_service = RAGService()
        
        # Initialize memory if needed
        if not rag_service._memory_initialized:
            await rag_service.memory_service.initialize()
            rag_service._memory_initialized = True
        
        # Validate inputs
        if not content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        if not category.strip():
            raise HTTPException(status_code=400, detail="Category cannot be empty")
        
        if not (0.0 <= importance <= 1.0):
            raise HTTPException(status_code=400, detail="Importance must be between 0.0 and 1.0")
        
        # Add memory
        memory_id = await rag_service.memory_service.add_dynamic_memory(
            content=content,
            category=category,
            tags=tags,
            importance=importance,
            metadata=metadata
        )
        
        return {
            "success": True,
            "memory_id": memory_id,
            "message": "Memory added successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to add memory", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to add memory")

"""
File Organizer Service

A FastAPI service for intelligent file organization and management.
"""

import os
import json
import asyncio
import hashlib
import mimetypes
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timezone
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator
from loguru import logger
import redis.asyncio as redis
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response, FileResponse
import aiofiles

# Prometheus metrics
REQUEST_COUNT = Counter('file_organizer_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('file_organizer_request_duration_seconds', 'Request duration')
FILE_OPERATIONS = Counter('file_organizer_operations_total', 'File operations', ['operation', 'status'])

# Security
security = HTTPBearer()

# Redis connection
redis_client: Optional[redis.Redis] = None

# Configuration
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "/tmp/uploads"))
UPLOAD_DIR.mkdir(exist_ok=True)

# Pydantic models
class FileInfo(BaseModel):
    """File information model"""
    id: str = Field(..., description="Unique file ID")
    name: str = Field(..., description="Original file name")
    path: str = Field(..., description="File path")
    size: int = Field(..., description="File size in bytes")
    mime_type: str = Field(..., description="MIME type")
    hash: str = Field(..., description="File hash")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list)

class FileUpload(BaseModel):
    """File upload model"""
    name: str = Field(..., description="File name")
    tags: List[str] = Field(default_factory=list)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class FileSearch(BaseModel):
    """File search model"""
    query: Optional[str] = Field(None, description="Search query")
    tags: List[str] = Field(default_factory=list)
    mime_types: List[str] = Field(default_factory=list)
    min_size: Optional[int] = Field(None, description="Minimum file size")
    max_size: Optional[int] = Field(None, description="Maximum file size")
    date_from: Optional[datetime] = Field(None, description="Date from")
    date_to: Optional[datetime] = Field(None, description="Date to")

class OrganizationRule(BaseModel):
    """File organization rule model"""
    id: str = Field(..., description="Rule ID")
    name: str = Field(..., description="Rule name")
    pattern: str = Field(..., description="File pattern (regex)")
    target_folder: str = Field(..., description="Target folder")
    enabled: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    logger.info("Starting File Organizer Service")
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
    title="File Organizer Service",
    description="Intelligent file organization and management service",
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

# Utility functions
async def calculate_file_hash(file_path: Path) -> str:
    """Calculate SHA256 hash of a file"""
    hash_sha256 = hashlib.sha256()
    async with aiofiles.open(file_path, "rb") as f:
        while chunk := await f.read(8192):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()

async def get_file_info(file_path: Path) -> Dict[str, Any]:
    """Get file information"""
    stat = file_path.stat()
    mime_type, _ = mimetypes.guess_type(str(file_path))
    
    return {
        "size": stat.st_size,
        "mime_type": mime_type or "application/octet-stream",
        "created_at": datetime.fromtimestamp(stat.st_ctime, tz=timezone.utc),
        "updated_at": datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc)
    }

# Routes
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "file-organizer", "timestamp": datetime.now(timezone.utc)}

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/files/upload", response_model=FileInfo)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    tags: str = "",
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Upload a file"""
    REQUEST_COUNT.labels(method="POST", endpoint="/files/upload").inc()
    
    with REQUEST_DURATION.time():
        try:
            # Generate unique file ID
            file_id = f"file_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
            
            # Create file path
            file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"
            
            # Save file
            async with aiofiles.open(file_path, "wb") as f:
                content = await file.read()
                await f.write(content)
            
            # Get file information
            file_info = await get_file_info(file_path)
            file_hash = await calculate_file_hash(file_path)
            
            # Parse tags
            file_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
            
            # Create file record
            file_record = FileInfo(
                id=file_id,
                name=file.filename,
                path=str(file_path),
                size=file_info["size"],
                mime_type=file_info["mime_type"],
                hash=file_hash,
                created_at=file_info["created_at"],
                updated_at=file_info["updated_at"],
                tags=file_tags,
                metadata={"user_id": current_user, "original_name": file.filename}
            )
            
            # Store in Redis
            await redis_client.hset(
                f"file:{file_id}",
                mapping={"data": file_record.json()}
            )
            
            # Add to user's file list
            await redis_client.sadd(f"user:{current_user}:files", file_id)
            
            # Background task for organization
            background_tasks.add_task(organize_file, file_id, file_record)
            
            FILE_OPERATIONS.labels(operation="upload", status="success").inc()
            logger.info(f"Uploaded file {file_id} for user {current_user}")
            
            return file_record
            
        except Exception as e:
            FILE_OPERATIONS.labels(operation="upload", status="error").inc()
            logger.error(f"Failed to upload file: {e}")
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/files", response_model=List[FileInfo])
async def list_files(
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """List user's files"""
    REQUEST_COUNT.labels(method="GET", endpoint="/files").inc()
    
    with REQUEST_DURATION.time():
        file_ids = await redis_client.smembers(f"user:{current_user}:files")
        files = []
        
        for file_id in file_ids:
            file_data = await redis_client.hget(f"file:{file_id}", "data")
            if file_data:
                files.append(FileInfo.parse_raw(file_data))
        
        # Sort by created_at descending
        files.sort(key=lambda x: x.created_at, reverse=True)
        
        return files

@app.get("/files/{file_id}", response_model=FileInfo)
async def get_file(
    file_id: str,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Get file information"""
    REQUEST_COUNT.labels(method="GET", endpoint="/files/{file_id}").inc()
    
    with REQUEST_DURATION.time():
        # Check if user has access to this file
        if not await redis_client.sismember(f"user:{current_user}:files", file_id):
            raise HTTPException(status_code=404, detail="File not found")
        
        file_data = await redis_client.hget(f"file:{file_id}", "data")
        if not file_data:
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileInfo.parse_raw(file_data)

@app.get("/files/{file_id}/download")
async def download_file(
    file_id: str,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Download a file"""
    REQUEST_COUNT.labels(method="GET", endpoint="/files/{file_id}/download").inc()
    
    with REQUEST_DURATION.time():
        # Check if user has access to this file
        if not await redis_client.sismember(f"user:{current_user}:files", file_id):
            raise HTTPException(status_code=404, detail="File not found")
        
        file_data = await redis_client.hget(f"file:{file_id}", "data")
        if not file_data:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_info = FileInfo.parse_raw(file_data)
        file_path = Path(file_info.path)
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found on disk")
        
        FILE_OPERATIONS.labels(operation="download", status="success").inc()
        
        return FileResponse(
            path=file_path,
            filename=file_info.name,
            media_type=file_info.mime_type
        )

@app.delete("/files/{file_id}")
async def delete_file(
    file_id: str,
    background_tasks: BackgroundTasks,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Delete a file"""
    REQUEST_COUNT.labels(method="DELETE", endpoint="/files/{file_id}").inc()
    
    with REQUEST_DURATION.time():
        # Check if user has access to this file
        if not await redis_client.sismember(f"user:{current_user}:files", file_id):
            raise HTTPException(status_code=404, detail="File not found")
        
        file_data = await redis_client.hget(f"file:{file_id}", "data")
        if not file_data:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_info = FileInfo.parse_raw(file_data)
        file_path = Path(file_info.path)
        
        # Remove from Redis
        await redis_client.delete(f"file:{file_id}")
        await redis_client.srem(f"user:{current_user}:files", file_id)
        
        # Background task to delete file from disk
        background_tasks.add_task(delete_file_from_disk, file_path)
        
        FILE_OPERATIONS.labels(operation="delete", status="success").inc()
        logger.info(f"Deleted file {file_id} for user {current_user}")
        
        return {"message": "File deleted successfully"}

@app.post("/files/search", response_model=List[FileInfo])
async def search_files(
    search_params: FileSearch,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Search files"""
    REQUEST_COUNT.labels(method="POST", endpoint="/files/search").inc()
    
    with REQUEST_DURATION.time():
        file_ids = await redis_client.smembers(f"user:{current_user}:files")
        matching_files = []
        
        for file_id in file_ids:
            file_data = await redis_client.hget(f"file:{file_id}", "data")
            if file_data:
                file_info = FileInfo.parse_raw(file_data)
                
                # Apply search filters
                if search_params.query and search_params.query.lower() not in file_info.name.lower():
                    continue
                
                if search_params.tags and not any(tag in file_info.tags for tag in search_params.tags):
                    continue
                
                if search_params.mime_types and file_info.mime_type not in search_params.mime_types:
                    continue
                
                if search_params.min_size and file_info.size < search_params.min_size:
                    continue
                
                if search_params.max_size and file_info.size > search_params.max_size:
                    continue
                
                if search_params.date_from and file_info.created_at < search_params.date_from:
                    continue
                
                if search_params.date_to and file_info.created_at > search_params.date_to:
                    continue
                
                matching_files.append(file_info)
        
        return matching_files

# Background tasks
async def organize_file(file_id: str, file_info: FileInfo):
    """Organize file based on rules"""
    logger.info(f"Organizing file {file_id}")
    
    # In production, implement intelligent file organization
    # This could include:
    # - Moving files to appropriate folders based on type
    # - Adding automatic tags based on content analysis
    # - Generating thumbnails for images
    # - Extracting metadata from files
    
    # Placeholder implementation
    if file_info.mime_type.startswith("image/"):
        # Move images to images folder
        target_folder = UPLOAD_DIR / "images"
        target_folder.mkdir(exist_ok=True)
        
        source_path = Path(file_info.path)
        target_path = target_folder / source_path.name
        
        try:
            source_path.rename(target_path)
            logger.info(f"Moved image {file_id} to images folder")
        except Exception as e:
            logger.error(f"Failed to move image {file_id}: {e}")

async def delete_file_from_disk(file_path: Path):
    """Delete file from disk"""
    try:
        if file_path.exists():
            file_path.unlink()
            logger.info(f"Deleted file from disk: {file_path}")
    except Exception as e:
        logger.error(f"Failed to delete file from disk {file_path}: {e}")

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
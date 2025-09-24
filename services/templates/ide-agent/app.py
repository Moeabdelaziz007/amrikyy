"""
IDE Agent Service

A FastAPI service for development environment integration and code assistance.
"""

import os
import json
import asyncio
import subprocess
import tempfile
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timezone
from pathlib import Path
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
REQUEST_COUNT = Counter('ide_agent_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('ide_agent_request_duration_seconds', 'Request duration')
CODE_OPERATIONS = Counter('ide_agent_operations_total', 'Code operations', ['operation', 'status'])

# Security
security = HTTPBearer()

# Redis connection
redis_client: Optional[redis.Redis] = None

# Pydantic models
class CodeFile(BaseModel):
    """Code file model"""
    id: str = Field(..., description="Unique file ID")
    name: str = Field(..., description="File name")
    path: str = Field(..., description="File path")
    content: str = Field(..., description="File content")
    language: str = Field(..., description="Programming language")
    size: int = Field(..., description="File size in bytes")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class CodeExecution(BaseModel):
    """Code execution model"""
    id: str = Field(..., description="Execution ID")
    code: str = Field(..., description="Code to execute")
    language: str = Field(..., description="Programming language")
    input_data: Optional[str] = Field(None, description="Input data")
    timeout: int = Field(default=30, description="Execution timeout in seconds")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CodeExecutionResult(BaseModel):
    """Code execution result model"""
    id: str = Field(..., description="Execution ID")
    status: str = Field(..., description="Execution status")
    output: Optional[str] = Field(None, description="Output")
    error: Optional[str] = Field(None, description="Error message")
    execution_time: float = Field(..., description="Execution time in seconds")
    memory_usage: Optional[int] = Field(None, description="Memory usage in bytes")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CodeAnalysis(BaseModel):
    """Code analysis model"""
    id: str = Field(..., description="Analysis ID")
    file_id: str = Field(..., description="File ID")
    analysis_type: str = Field(..., description="Analysis type")
    results: Dict[str, Any] = Field(..., description="Analysis results")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CodeSuggestion(BaseModel):
    """Code suggestion model"""
    id: str = Field(..., description="Suggestion ID")
    file_id: str = Field(..., description="File ID")
    line_number: int = Field(..., description="Line number")
    suggestion_type: str = Field(..., description="Suggestion type")
    message: str = Field(..., description="Suggestion message")
    code: Optional[str] = Field(None, description="Suggested code")
    confidence: float = Field(..., description="Confidence score (0-1)")
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
    logger.info("Starting IDE Agent Service")
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
    title="IDE Agent Service",
    description="Development environment integration and code assistance service",
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
def detect_language(filename: str) -> str:
    """Detect programming language from filename"""
    extensions = {
        '.py': 'python',
        '.js': 'javascript',
        '.ts': 'typescript',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c',
        '.go': 'go',
        '.rs': 'rust',
        '.php': 'php',
        '.rb': 'ruby',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.scala': 'scala',
        '.r': 'r',
        '.m': 'matlab',
        '.sql': 'sql',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.less': 'less',
        '.xml': 'xml',
        '.json': 'json',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.md': 'markdown',
        '.sh': 'bash',
        '.bat': 'batch',
        '.ps1': 'powershell'
    }
    
    ext = Path(filename).suffix.lower()
    return extensions.get(ext, 'text')

async def execute_code(code: str, language: str, input_data: Optional[str] = None, timeout: int = 30) -> Dict[str, Any]:
    """Execute code in a sandboxed environment"""
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix=f'.{language}', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        # Execute based on language
        if language == 'python':
            cmd = ['python', temp_file]
        elif language == 'javascript':
            cmd = ['node', temp_file]
        elif language == 'bash':
            cmd = ['bash', temp_file]
        else:
            raise ValueError(f"Unsupported language: {language}")
        
        # Execute with timeout
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            stdin=asyncio.subprocess.PIPE if input_data else None
        )
        
        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(input=input_data.encode() if input_data else None),
                timeout=timeout
            )
            
            return {
                'status': 'success',
                'output': stdout.decode(),
                'error': stderr.decode() if stderr else None,
                'return_code': process.returncode
            }
            
        except asyncio.TimeoutError:
            process.kill()
            return {
                'status': 'timeout',
                'output': None,
                'error': f'Execution timed out after {timeout} seconds',
                'return_code': -1
            }
            
    except Exception as e:
        return {
            'status': 'error',
            'output': None,
            'error': str(e),
            'return_code': -1
        }
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_file)
        except:
            pass

# Routes
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ide-agent", "timestamp": datetime.now(timezone.utc)}

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/files", response_model=CodeFile)
async def create_file(
    name: str,
    content: str,
    path: str,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Create a new code file"""
    REQUEST_COUNT.labels(method="POST", endpoint="/files").inc()
    
    with REQUEST_DURATION.time():
        try:
            # Generate unique file ID
            file_id = f"file_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
            
            # Detect language
            language = detect_language(name)
            
            # Create file record
            file_record = CodeFile(
                id=file_id,
                name=name,
                path=path,
                content=content,
                language=language,
                size=len(content.encode('utf-8')),
                metadata={"user_id": current_user}
            )
            
            # Store in Redis
            await redis_client.hset(
                f"code_file:{file_id}",
                mapping={"data": file_record.json()}
            )
            
            # Add to user's file list
            await redis_client.sadd(f"user:{current_user}:code_files", file_id)
            
            CODE_OPERATIONS.labels(operation="create_file", status="success").inc()
            logger.info(f"Created code file {file_id} for user {current_user}")
            
            return file_record
            
        except Exception as e:
            CODE_OPERATIONS.labels(operation="create_file", status="error").inc()
            logger.error(f"Failed to create file: {e}")
            raise HTTPException(status_code=500, detail=f"File creation failed: {str(e)}")

@app.get("/files", response_model=List[CodeFile])
async def list_files(
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """List user's code files"""
    REQUEST_COUNT.labels(method="GET", endpoint="/files").inc()
    
    with REQUEST_DURATION.time():
        file_ids = await redis_client.smembers(f"user:{current_user}:code_files")
        files = []
        
        for file_id in file_ids:
            file_data = await redis_client.hget(f"code_file:{file_id}", "data")
            if file_data:
                files.append(CodeFile.parse_raw(file_data))
        
        # Sort by updated_at descending
        files.sort(key=lambda x: x.updated_at, reverse=True)
        
        return files

@app.get("/files/{file_id}", response_model=CodeFile)
async def get_file(
    file_id: str,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Get a specific code file"""
    REQUEST_COUNT.labels(method="GET", endpoint="/files/{file_id}").inc()
    
    with REQUEST_DURATION.time():
        # Check if user has access to this file
        if not await redis_client.sismember(f"user:{current_user}:code_files", file_id):
            raise HTTPException(status_code=404, detail="File not found")
        
        file_data = await redis_client.hget(f"code_file:{file_id}", "data")
        if not file_data:
            raise HTTPException(status_code=404, detail="File not found")
        
        return CodeFile.parse_raw(file_data)

@app.put("/files/{file_id}", response_model=CodeFile)
async def update_file(
    file_id: str,
    content: str,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Update a code file"""
    REQUEST_COUNT.labels(method="PUT", endpoint="/files/{file_id}").inc()
    
    with REQUEST_DURATION.time():
        # Check if user has access to this file
        if not await redis_client.sismember(f"user:{current_user}:code_files", file_id):
            raise HTTPException(status_code=404, detail="File not found")
        
        file_data = await redis_client.hget(f"code_file:{file_id}", "data")
        if not file_data:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_record = CodeFile.parse_raw(file_data)
        file_record.content = content
        file_record.size = len(content.encode('utf-8'))
        file_record.updated_at = datetime.now(timezone.utc)
        
        # Update in Redis
        await redis_client.hset(
            f"code_file:{file_id}",
            mapping={"data": file_record.json()}
        )
        
        CODE_OPERATIONS.labels(operation="update_file", status="success").inc()
        logger.info(f"Updated code file {file_id} for user {current_user}")
        
        return file_record

@app.post("/execute", response_model=CodeExecutionResult)
async def execute_code_endpoint(
    execution: CodeExecution,
    background_tasks: BackgroundTasks,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Execute code"""
    REQUEST_COUNT.labels(method="POST", endpoint="/execute").inc()
    
    with REQUEST_DURATION.time():
        try:
            # Generate execution ID
            execution_id = f"exec_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
            
            # Execute code
            start_time = datetime.now()
            result = await execute_code(
                execution.code,
                execution.language,
                execution.input_data,
                execution.timeout
            )
            end_time = datetime.now()
            
            execution_time = (end_time - start_time).total_seconds()
            
            # Create result record
            result_record = CodeExecutionResult(
                id=execution_id,
                status=result['status'],
                output=result['output'],
                error=result['error'],
                execution_time=execution_time,
                created_at=start_time
            )
            
            # Store in Redis
            await redis_client.hset(
                f"execution:{execution_id}",
                mapping={"data": result_record.json()}
            )
            
            # Add to user's execution list
            await redis_client.sadd(f"user:{current_user}:executions", execution_id)
            
            CODE_OPERATIONS.labels(operation="execute_code", status="success").inc()
            logger.info(f"Executed code {execution_id} for user {current_user}")
            
            return result_record
            
        except Exception as e:
            CODE_OPERATIONS.labels(operation="execute_code", status="error").inc()
            logger.error(f"Failed to execute code: {e}")
            raise HTTPException(status_code=500, detail=f"Code execution failed: {str(e)}")

@app.post("/analyze/{file_id}", response_model=CodeAnalysis)
async def analyze_code(
    file_id: str,
    analysis_type: str,
    background_tasks: BackgroundTasks,
    current_user: str = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    """Analyze code"""
    REQUEST_COUNT.labels(method="POST", endpoint="/analyze/{file_id}").inc()
    
    with REQUEST_DURATION.time():
        # Check if user has access to this file
        if not await redis_client.sismember(f"user:{current_user}:code_files", file_id):
            raise HTTPException(status_code=404, detail="File not found")
        
        file_data = await redis_client.hget(f"code_file:{file_id}", "data")
        if not file_data:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_record = CodeFile.parse_raw(file_data)
        
        # Generate analysis ID
        analysis_id = f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        
        # Perform analysis (placeholder implementation)
        analysis_results = {
            "lines_of_code": len(file_record.content.split('\n')),
            "complexity": "low",  # Placeholder
            "issues": [],  # Placeholder
            "suggestions": []  # Placeholder
        }
        
        # Create analysis record
        analysis_record = CodeAnalysis(
            id=analysis_id,
            file_id=file_id,
            analysis_type=analysis_type,
            results=analysis_results
        )
        
        # Store in Redis
        await redis_client.hset(
            f"analysis:{analysis_id}",
            mapping={"data": analysis_record.json()}
        )
        
        # Background task for detailed analysis
        background_tasks.add_task(perform_detailed_analysis, file_id, analysis_type)
        
        CODE_OPERATIONS.labels(operation="analyze_code", status="success").inc()
        logger.info(f"Analyzed code {file_id} for user {current_user}")
        
        return analysis_record

# Background tasks
async def perform_detailed_analysis(file_id: str, analysis_type: str):
    """Perform detailed code analysis"""
    logger.info(f"Performing detailed analysis for file {file_id}")
    
    # In production, implement detailed analysis:
    # - Syntax checking
    # - Code quality metrics
    # - Security vulnerability scanning
    # - Performance analysis
    # - Code style checking
    
    # Placeholder implementation
    await asyncio.sleep(1)
    logger.info(f"Completed detailed analysis for file {file_id}")

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

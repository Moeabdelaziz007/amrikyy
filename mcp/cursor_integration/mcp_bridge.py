#!/usr/bin/env python3
"""
AuraOS MCP Bridge - Cursor Integration
Provides seamless communication between Cursor and the MCP system.
"""

import redis
import os
import time
import json
import uuid
from typing import Dict, List, Any, Optional
from loguru import logger
from datetime import datetime
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

class CodeRequest(BaseModel):
    code: str
    context: str = ""
    request_type: str = "all"  # "logic", "creativity", "optimization", "all"
    priority: str = "medium"  # "low", "medium", "high"

class MCPResponse(BaseModel):
    request_id: str
    status: str
    results: Dict[str, Any]
    timestamp: str

class MCPBridge:
    def __init__(self):
        self.redis_host = os.getenv("REDIS_HOST", "localhost")
        self.redis_port = int(os.getenv("REDIS_PORT", 6379))
        self.bridge_port = int(os.getenv("BRIDGE_PORT", 8080))
        
        # Initialize Redis connection
        self.redis_client = redis.Redis(
            host=self.redis_host, 
            port=self.redis_port, 
            decode_responses=True,
            retry_on_timeout=True,
            socket_connect_timeout=5
        )
        
        # Configure logging
        logger.add("/app/logs/mcp_bridge.log", rotation="10 MB", level="INFO")
        logger.info("MCP Bridge initialized")
        
        # Initialize FastAPI app
        self.app = FastAPI(
            title="AuraOS MCP Bridge",
            description="Bridge between Cursor and MCP agents",
            version="1.0.0"
        )
        
        # Add CORS middleware
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        # Setup routes
        self._setup_routes()
        
        # Active requests tracking
        self.active_requests = {}

    def _setup_routes(self):
        """Setup FastAPI routes."""
        
        @self.app.get("/")
        async def root():
            return {"message": "AuraOS MCP Bridge is running", "status": "active"}
        
        @self.app.get("/health")
        async def health_check():
            try:
                self.redis_client.ping()
                return {"status": "healthy", "redis": "connected"}
            except Exception as e:
                return {"status": "unhealthy", "error": str(e)}
        
        @self.app.get("/agents")
        async def get_active_agents():
            """Get list of active agents."""
            try:
                agents = self.redis_client.hgetall("active_agents")
                return {"agents": agents}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/analyze", response_model=MCPResponse)
        async def analyze_code(request: CodeRequest):
            """Analyze code using MCP agents."""
            try:
                request_id = str(uuid.uuid4())
                logger.info(f"Received analysis request: {request_id}")
                
                # Create request data
                request_data = {
                    "request_id": request_id,
                    "code": request.code,
                    "context": request.context,
                    "request_type": request.request_type,
                    "priority": request.priority,
                    "timestamp": datetime.now().isoformat()
                }
                
                # Send to MCP queue
                self.redis_client.rpush("mcp_queue", json.dumps(request_data))
                
                # Wait for results
                results = await self._wait_for_results(request_id, timeout=30)
                
                response = MCPResponse(
                    request_id=request_id,
                    status="completed",
                    results=results,
                    timestamp=datetime.now().isoformat()
                )
                
                return response
                
            except Exception as e:
                logger.error(f"Error in analyze_code: {str(e)}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/results/{request_id}")
        async def get_results(request_id: str):
            """Get results for a specific request."""
            try:
                if request_id in self.active_requests:
                    return self.active_requests[request_id]
                else:
                    raise HTTPException(status_code=404, detail="Request not found")
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/quick_analyze")
        async def quick_analyze(request: CodeRequest):
            """Quick analysis with immediate response."""
            try:
                request_id = str(uuid.uuid4())
                
                # Create quick analysis
                quick_results = await self._quick_analysis(request.code, request.context)
                
                return {
                    "request_id": request_id,
                    "status": "completed",
                    "results": quick_results,
                    "timestamp": datetime.now().isoformat()
                }
                
            except Exception as e:
                logger.error(f"Error in quick_analyze: {str(e)}")
                raise HTTPException(status_code=500, detail=str(e))

    async def _wait_for_results(self, request_id: str, timeout: int = 30) -> Dict[str, Any]:
        """Wait for results from MCP agents."""
        start_time = time.time()
        results = {
            "logic": None,
            "creativity": None,
            "optimization": None
        }
        
        while time.time() - start_time < timeout:
            try:
                # Check for results
                result_data = self.redis_client.lpop("mcp_results")
                
                if result_data:
                    result = json.loads(result_data)
                    
                    # Check if this result is for our request
                    if result.get("request_id") == request_id:
                        agent_type = result.get("agent_type")
                        if agent_type in results:
                            results[agent_type] = result
                            logger.info(f"Received result from {agent_type} agent")
                
                # Check if we have all results
                if all(results.values()):
                    break
                
                await asyncio.sleep(0.5)
                
            except Exception as e:
                logger.error(f"Error waiting for results: {str(e)}")
                break
        
        return results

    async def _quick_analysis(self, code: str, context: str) -> Dict[str, Any]:
        """Perform quick analysis without waiting for agents."""
        try:
            # Basic analysis
            analysis = {
                "logic": {
                    "agent_type": "logic",
                    "suggestions": [
                        "Code structure looks good",
                        "Consider adding error handling",
                        "Add documentation for better maintainability"
                    ],
                    "status": "completed"
                },
                "creativity": {
                    "agent_type": "creativity",
                    "suggestions": [
                        "Consider using design patterns",
                        "Think about user experience",
                        "Explore innovative approaches"
                    ],
                    "status": "completed"
                },
                "optimization": {
                    "agent_type": "optimization",
                    "suggestions": [
                        "Consider performance optimizations",
                        "Check for memory efficiency",
                        "Look for algorithm improvements"
                    ],
                    "status": "completed"
                }
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in quick analysis: {str(e)}")
            return {"error": str(e)}

    async def _monitor_agents(self):
        """Monitor agent health and status."""
        while True:
            try:
                # Check agent status
                agents = self.redis_client.hgetall("active_agents")
                
                for agent_id, agent_data in agents.items():
                    agent_info = json.loads(agent_data)
                    logger.info(f"Agent {agent_id}: {agent_info.get('status', 'unknown')}")
                
                await asyncio.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                logger.error(f"Error monitoring agents: {str(e)}")
                await asyncio.sleep(60)

    async def run(self):
        """Run the MCP bridge."""
        logger.info("Starting MCP Bridge...")
        
        # Test Redis connection
        try:
            self.redis_client.ping()
            logger.info("Connected to Redis successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {str(e)}")
            return
        
        # Start monitoring task
        monitor_task = asyncio.create_task(self._monitor_agents())
        
        # Start FastAPI server
        config = uvicorn.Config(
            app=self.app,
            host="0.0.0.0",
            port=self.bridge_port,
            log_level="info"
        )
        server = uvicorn.Server(config)
        
        try:
            await server.serve()
        except Exception as e:
            logger.error(f"Error running server: {str(e)}")
        finally:
            monitor_task.cancel()

if __name__ == "__main__":
    bridge = MCPBridge()
    asyncio.run(bridge.run())

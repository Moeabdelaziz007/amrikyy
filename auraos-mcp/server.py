from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import os, requests

app = FastAPI(title="AuraOS MCP Adapter")

AURAOS_URL = os.environ.get("AURAOS_API_URL", "http://localhost:8001")
AURAOS_KEY = os.environ.get("AURAOS_API_KEY", "")

HEADERS = {"Authorization": f"Bearer {AURAOS_KEY}"} if AURAOS_KEY else {}

@app.get("/mcp/health")
async def health():
    return {
        "status": "ok",
        "service": "auraos-mcp",
        "auraos_url": AURAOS_URL,
        "has_key": bool(AURAOS_KEY),
    }

@app.post("/mcp/describe")
async def describe():
    return {
        "name": "AuraOS MCP",
        "version": "0.1",
        "capabilities": ["list_workflows", "restart_service", "get_metrics", "get_logs"]
    }

@app.post("/mcp/list_workflows")
async def list_workflows():
    try:
        r = requests.get(f"{AURAOS_URL}/api/workflows", headers=HEADERS, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RestartServiceRequest(BaseModel):
    service: str = Field(..., description="Service name to restart")

@app.post("/mcp/restart_service")
async def restart_service(payload: RestartServiceRequest):
    service = payload.service
    try:
        r = requests.post(f"{AURAOS_URL}/api/services/{service}/restart", headers=HEADERS, timeout=20)
        r.raise_for_status()
        return {"status": "ok", "detail": r.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class QueryParams(BaseModel):
    params: Optional[Dict[str, Any]] = Field(default_factory=dict)

@app.post("/mcp/get_metrics")
async def get_metrics(payload: QueryParams = QueryParams()):
    try:
        r = requests.get(f"{AURAOS_URL}/api/metrics", headers=HEADERS, params=payload.params, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/mcp/get_logs")
async def get_logs(payload: QueryParams = QueryParams()):
    try:
        r = requests.get(f"{AURAOS_URL}/api/logs", headers=HEADERS, params=payload.params, timeout=20)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entrypoint for running directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")



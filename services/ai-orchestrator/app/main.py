from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatIn(BaseModel):
    session_id: Optional[str] = None
    message: str
    user_id: Optional[str] = None


@app.post("/v1/chat")
async def chat(inp: ChatIn):
    # Placeholder for RAG + memory + LLM provider call
    return {
        "session_id": inp.session_id,
        "reply": "مرحبًا من منسّق الذكاء الاصطناعي",
        "sources": [],
    }


class ToolCall(BaseModel):
    name: str
    args: dict


@app.post("/v1/tools/invoke")
async def tools_invoke(call: ToolCall):
    # Placeholder for tool dispatching
    return {"name": call.name, "result": {"ok": True}}


class PlanIn(BaseModel):
    goal: str
    constraints: Optional[List[str]] = None


@app.post("/v1/plan")
async def plan(inp: PlanIn):
    steps = [f"تحليل الهدف: {inp.goal}", "استرجاع المعرفة", "إنتاج الإجابة"]
    return {"steps": steps}



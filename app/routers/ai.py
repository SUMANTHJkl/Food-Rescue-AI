from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from services.openrouter_ai import analyze_food_condition_ai, query_openrouter_ai

router = APIRouter(prefix="/ai", tags=["ai"])


class AIChatRequest(BaseModel):
    message: str
    context: Optional[str] = None


class AIChatResponse(BaseModel):
    response: str


class ConditionAnalysisRequest(BaseModel):
    food_item: str
    plates_count: int
    hours_since_prep: float
    storage_temp: str = "ambient"


@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(payload: AIChatRequest):
    prompt = payload.message
    if payload.context:
        prompt = f"Context: {payload.context}\nUser Question: {payload.message}"
    reply = await query_openrouter_ai(prompt)
    return {"response": reply}


@router.post("/analyze-condition")
def analyze_condition(payload: ConditionAnalysisRequest):
    res = analyze_food_condition_ai(
        food_item=payload.food_item,
        plates_count=payload.plates_count,
        hours_since_prep=payload.hours_since_prep,
        storage_temp=payload.storage_temp,
    )
    return res

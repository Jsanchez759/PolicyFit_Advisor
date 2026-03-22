"""Recommendation endpoints"""
from uuid import uuid4
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from api.core.llm_client import chat_json, chat_text
from api.core.config import settings
from api.core.storage import (
    create_analysis_record,
    delete_analysis_record,
    get_analysis_record,
    get_analysis_chat_messages,
    get_business_record,
    get_policy_record,
    list_analysis_records,
    save_analysis_chat_messages,
)
from api.schemas.recommendation import AnalysisRequest, AnalysisResult

router = APIRouter()


class AnalysisChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


@router.get("/")
async def list_analyses():
    """List all generated analyses."""
    analyses = list_analysis_records()
    analyses.sort(key=lambda item: item.get("created_at", ""), reverse=True)
    return analyses


def _fallback_analysis(request: AnalysisRequest) -> dict:
    """Simple fallback output when LLM is unavailable."""
    return {
        "analysis_id": str(uuid4()),
        "business_id": request.business_id,
        "policy_id": request.policy_id,
        "coverage_gaps": [
            {
                "gap_type": "manual_review_required",
                "severity": "medium",
                "description": "Could not complete LLM recommendation flow; manual review is suggested.",
                "affected_areas": ["general"],
            }
        ],
        "recommendations": [
            {
                "coverage_type": "policy_audit",
                "priority": "medium",
                "rationale": "Validate policy sufficiency with an advisor and compare endorsements.",
                "estimated_cost_range": None,
                "affected_business_areas": ["operations"],
            }
        ],
        "overall_risk_score": 50.0,
        "summary": "Automated recommendation is temporarily unavailable; manual review recommended.",
    }


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_coverage(request: AnalysisRequest, http_request: Request):
    """
    Analyze coverage gaps and generate recommendations
    
    Args:
        request: Analysis request with business and policy IDs
        
    Returns:
        Analysis result with gaps and recommendations
    """
    business = get_business_record(request.business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    policy = get_policy_record(request.policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    created_at = datetime.now(timezone.utc).isoformat()

    request_api_key = http_request.headers.get("x-openrouter-api-key")

    if not (request_api_key or settings.OPENROUTER_API_KEY):
        result = _fallback_analysis(request)
        result["created_at"] = created_at
        result["updated_at"] = created_at
        create_analysis_record(result)
        return result

    system_prompt = (
        "You are an insurance analyst assistant. "
        "Evaluate policy sufficiency against business profile and propose practical coverage recommendations. "
        "Return strict JSON only with keys: coverage_gaps, recommendations, overall_risk_score, summary."
    )
    user_prompt = (
        "Analyze this business profile and extracted policy details.\n"
        "Identify whether policy appears sufficient, main gaps, and useful recommendations.\n"
        "Rules:\n"
        "- coverage_gaps: list of {gap_type, severity(low|medium|high|critical), description, affected_areas[]}\n"
        "- recommendations: list of {coverage_type, priority(low|medium|high), rationale, estimated_cost_range, affected_business_areas[]}\n"
        "- overall_risk_score: number 0-100 (higher = more risk)\n"
        "- summary: brief plain-language summary\n\n"
        f"BUSINESS:\n{business}\n\n"
        f"POLICY_EXTRACTION:\n{policy.get('extraction', {})}"
    )

    try:
        parsed = await chat_json(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            api_key=request_api_key,
        )
    except Exception:
        parsed = {}

    analysis_id = str(uuid4())
    result = {
        "analysis_id": analysis_id,
        "business_id": request.business_id,
        "policy_id": request.policy_id,
        "coverage_gaps": parsed.get("coverage_gaps", []) or [],
        "recommendations": parsed.get("recommendations", []) or [],
        "overall_risk_score": float(parsed.get("overall_risk_score", 50.0)),
        "summary": str(parsed.get("summary", "Recommendation analysis completed.")),
        "created_at": created_at,
        "updated_at": created_at,
    }

    # Ensure response remains valid even when LLM returns incomplete payload.
    if not result["coverage_gaps"] and not result["recommendations"]:
        fallback = _fallback_analysis(request)
        result["coverage_gaps"] = fallback["coverage_gaps"]
        result["recommendations"] = fallback["recommendations"]
        result["summary"] = fallback["summary"]

    create_analysis_record(result)
    return result


@router.get("/{analysis_id}")
async def get_analysis(analysis_id: str):
    """
    Retrieve analysis result
    
    Args:
        analysis_id: Analysis identifier
        
    Returns:
        Analysis result
    """
    analysis = get_analysis_record(analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis


@router.delete("/{analysis_id}")
async def delete_analysis(analysis_id: str):
    """Delete stored analysis by id."""
    existing = get_analysis_record(analysis_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Analysis not found")

    delete_analysis_record(analysis_id)
    return {"analysis_id": analysis_id, "status": "deleted"}


@router.get("/{analysis_id}/chat")
async def get_analysis_chat(analysis_id: str):
    analysis = get_analysis_record(analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"analysis_id": analysis_id, "messages": get_analysis_chat_messages(analysis_id)}


@router.post("/{analysis_id}/chat")
async def send_analysis_chat_message(
    analysis_id: str,
    payload: AnalysisChatRequest,
    http_request: Request,
):
    analysis = get_analysis_record(analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    business = get_business_record(analysis["business_id"])
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    request_api_key = http_request.headers.get("x-openrouter-api-key")
    if not (request_api_key or settings.OPENROUTER_API_KEY):
        raise HTTPException(status_code=400, detail="OpenRouter API key is required")

    existing_messages = get_analysis_chat_messages(analysis_id)
    now = datetime.now(timezone.utc).isoformat()
    user_msg = {"role": "user", "content": payload.message, "timestamp": now}

    llm_messages = [
        {"role": m.get("role", "user"), "content": m.get("content", "")}
        for m in existing_messages[-12:]
    ]
    llm_messages.append({"role": "user", "content": payload.message})

    system_prompt = (
        "You are a helpful insurance coverage assistant. "
        "Answer user questions about this analysis and business context. "
        "Be practical, concise, and clear when uncertain.\n\n"
        f"ANALYSIS_CONTEXT: {analysis}\n\n"
        f"BUSINESS_CONTEXT: {business}"
    )

    assistant_text = await chat_text(
        system_prompt=system_prompt,
        messages=llm_messages,
        api_key=request_api_key,
    )
    assistant_msg = {
        "role": "assistant",
        "content": assistant_text or "I could not generate a response for that question.",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    updated = [*existing_messages, user_msg, assistant_msg]
    save_analysis_chat_messages(analysis_id, updated, updated_at=assistant_msg["timestamp"])

    return {
        "analysis_id": analysis_id,
        "assistant_message": assistant_msg,
        "messages": updated,
    }

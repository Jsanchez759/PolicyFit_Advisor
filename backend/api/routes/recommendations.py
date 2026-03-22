"""Recommendation endpoints"""
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from api.core.llm_client import chat_json
from api.core.config import settings
from api.routes.business import BUSINESS_STORE
from api.routes.policies import POLICY_STORE
from api.schemas.recommendation import AnalysisRequest, AnalysisResult

router = APIRouter()
ANALYSIS_STORE: dict[str, dict] = {}


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
async def analyze_coverage(request: AnalysisRequest):
    """
    Analyze coverage gaps and generate recommendations
    
    Args:
        request: Analysis request with business and policy IDs
        
    Returns:
        Analysis result with gaps and recommendations
    """
    business = BUSINESS_STORE.get(request.business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    policy = POLICY_STORE.get(request.policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    if not settings.OPENROUTER_API_KEY:
        result = _fallback_analysis(request)
        ANALYSIS_STORE[result["analysis_id"]] = result
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
        parsed = await chat_json(system_prompt=system_prompt, user_prompt=user_prompt)
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
    }

    # Ensure response remains valid even when LLM returns incomplete payload.
    if not result["coverage_gaps"] and not result["recommendations"]:
        fallback = _fallback_analysis(request)
        result["coverage_gaps"] = fallback["coverage_gaps"]
        result["recommendations"] = fallback["recommendations"]
        result["summary"] = fallback["summary"]

    ANALYSIS_STORE[analysis_id] = result
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
    analysis = ANALYSIS_STORE.get(analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

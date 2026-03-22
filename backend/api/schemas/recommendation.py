"""Recommendation schemas"""
from pydantic import BaseModel
from typing import Optional, List


class CoverageGap(BaseModel):
    """Identified coverage gap"""
    gap_type: str
    severity: str  # "low", "medium", "high", "critical"
    description: str
    affected_areas: List[str] = []


class RecommendedCoverage(BaseModel):
    """Recommended insurance coverage"""
    coverage_type: str
    priority: str  # "low", "medium", "high"
    rationale: str
    estimated_cost_range: Optional[str] = None
    affected_business_areas: List[str] = []


class AnalysisResult(BaseModel):
    """Complete analysis result"""
    analysis_id: str
    business_id: str
    policy_id: str
    coverage_gaps: List[CoverageGap]
    recommendations: List[RecommendedCoverage]
    overall_risk_score: float
    summary: str


class AnalysisRequest(BaseModel):
    """Request for analysis"""
    business_id: str
    policy_id: str

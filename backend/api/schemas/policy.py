"""Policy document schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PolicyUpload(BaseModel):
    """Policy document upload metadata"""
    filename: str
    file_type: str
    upload_date: datetime = datetime.now()


class PolicyExtraction(BaseModel):
    """Extracted policy information"""
    policy_id: str
    policy_type: str
    coverage_types: list[str]
    coverage_limits: dict
    deductibles: dict
    exclusions: list[str]
    effective_date: Optional[str] = None
    expiration_date: Optional[str] = None


class PolicyDocument(BaseModel):
    """Complete policy document"""
    id: str
    filename: str
    extraction: PolicyExtraction
    upload_date: datetime

"""Business data schemas"""
from pydantic import BaseModel
from typing import Optional, List


class NAICSCode(BaseModel):
    """NAICS Industry Classification"""
    code: str
    description: str


class BusinessData(BaseModel):
    """Business information for analysis"""
    company_name: str
    naics_code: str
    naics_description: Optional[str] = None
    employees: int
    annual_revenue: Optional[float] = None
    products: List[str] = []
    operations: List[str] = []
    locations: Optional[List[str]] = None
    years_in_operation: Optional[int] = None


class BusinessDataResponse(BusinessData):
    """Response model for business data"""
    id: str

"""Business data endpoints"""
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from api.schemas.business import BusinessData, BusinessDataResponse

router = APIRouter()
BUSINESS_STORE: dict[str, dict] = {}


@router.post("/", response_model=BusinessDataResponse)
async def create_business(business: BusinessData):
    """
    Create or register business data
    
    Args:
        business: Business information
        
    Returns:
        Created business data with ID
    """
    business_id = str(uuid4())
    payload = {"id": business_id, **business.model_dump()}
    BUSINESS_STORE[business_id] = payload
    return payload


@router.get("/", response_model=list[BusinessDataResponse])
async def list_businesses():
    """List all stored businesses."""
    return list(BUSINESS_STORE.values())


@router.get("/{business_id}", response_model=BusinessDataResponse)
async def get_business(business_id: str):
    """
    Retrieve business information
    
    Args:
        business_id: Business identifier
        
    Returns:
        Business data
    """
    business = BUSINESS_STORE.get(business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.put("/{business_id}", response_model=BusinessDataResponse)
async def update_business(business_id: str, business: BusinessData):
    """
    Update business information
    
    Args:
        business_id: Business identifier
        business: Updated business data
        
    Returns:
        Updated business data
    """
    if business_id not in BUSINESS_STORE:
        raise HTTPException(status_code=404, detail="Business not found")

    updated = {"id": business_id, **business.model_dump()}
    BUSINESS_STORE[business_id] = updated
    return updated


@router.delete("/{business_id}")
async def delete_business(business_id: str):
    """
    Delete business data
    
    Args:
        business_id: Business identifier
        
    Returns:
        Deletion confirmation
    """
    if business_id not in BUSINESS_STORE:
        raise HTTPException(status_code=404, detail="Business not found")

    BUSINESS_STORE.pop(business_id, None)
    return {
        "business_id": business_id,
        "status": "deleted"
    }

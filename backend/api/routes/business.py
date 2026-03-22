"""Business data endpoints"""
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from api.core.storage import (
    create_business_record,
    delete_business_record,
    get_business_record,
    list_business_records,
    update_business_record,
)
from api.schemas.business import BusinessData, BusinessDataResponse

router = APIRouter()


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
    now = datetime.now(timezone.utc).isoformat()
    payload = {"id": business_id, **business.model_dump(), "created_at": now, "updated_at": now}
    create_business_record(payload)
    return payload


@router.get("/", response_model=list[BusinessDataResponse])
async def list_businesses():
    """List all stored businesses."""
    return list_business_records()


@router.get("/{business_id}", response_model=BusinessDataResponse)
async def get_business(business_id: str):
    """
    Retrieve business information
    
    Args:
        business_id: Business identifier
        
    Returns:
        Business data
    """
    business = get_business_record(business_id)
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
    existing = get_business_record(business_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Business not found")

    updated = {
        "id": business_id,
        **business.model_dump(),
        "created_at": existing.get("created_at"),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    update_business_record(updated)
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
    existing = get_business_record(business_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Business not found")

    delete_business_record(business_id)
    return {
        "business_id": business_id,
        "status": "deleted"
    }

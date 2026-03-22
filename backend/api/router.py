"""API v1 router configuration."""
from fastapi import APIRouter

from api.routes import policies, business, recommendations, reports

router = APIRouter()

# Include versioned routes
router.include_router(policies.router, prefix="/policies", tags=["Policies"])
router.include_router(business.router, prefix="/business", tags=["Business"])
router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
router.include_router(reports.router, prefix="/reports", tags=["Reports"])


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@router.get("/")
async def main():
    """Main endpoint"""
    return {"status": "healthy",
            "message": "Welcome to the PolicyFit Advisor API. Please refer to the documentation for available endpoints."}
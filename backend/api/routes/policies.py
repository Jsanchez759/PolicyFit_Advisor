"""Policy document endpoints"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from api.modules.ingestion.processor import DocumentProcessor
from api.modules.extraction.extractor import PolicyExtractor
from api.core.config import settings

router = APIRouter()
processor = DocumentProcessor(settings.UPLOAD_DIR)
extractor = PolicyExtractor()


@router.post("/upload")
async def upload_policy(file: UploadFile = File(...)):
    """
    Upload a policy document (PDF or DOCX)
    
    Args:
        file: Policy document file
        
    Returns:
        Upload confirmation with policy ID
    """
    # Validate file type
    if not processor.validate_file(file.filename, settings.ALLOWED_FILE_TYPES):
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_FILE_TYPES)}"
        )
    
    # Validate file size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
        )
    
    # Save file
    file_path = await processor.save_document(content, file.filename)
    
    # TODO: Process document and extract information
    
    return {
        "policy_id": "temp_id",  # Would be generated
        "filename": file.filename,
        "status": "uploaded",
        "message": "Policy document uploaded successfully"
    }


@router.get("/{policy_id}")
async def get_policy(policy_id: str):
    """
    Retrieve policy information
    
    Args:
        policy_id: Policy identifier
        
    Returns:
        Policy information
    """
    # TODO: Implement policy retrieval
    return {
        "policy_id": policy_id,
        "status": "pending"
    }


@router.delete("/{policy_id}")
async def delete_policy(policy_id: str):
    """
    Delete a policy document
    
    Args:
        policy_id: Policy identifier
        
    Returns:
        Deletion confirmation
    """
    # TODO: Implement policy deletion
    return {
        "policy_id": policy_id,
        "status": "deleted"
    }

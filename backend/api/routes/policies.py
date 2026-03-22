"""Policy document endpoints"""
from pathlib import Path
from uuid import uuid4
from datetime import datetime, timezone

from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from api.core.storage import (
    create_policy_record,
    delete_policy_record,
    get_policy_record,
    list_policy_records,
)
from api.modules.ingestion.processor import DocumentProcessor
from api.modules.extraction.extractor import PolicyExtractor
from api.core.config import settings

router = APIRouter()
processor = DocumentProcessor(settings.UPLOAD_DIR)
extractor = PolicyExtractor()


@router.post("/upload")
async def upload_policy(request: Request, file: UploadFile = File(...)):
    """
    Upload a policy document (PDF)
    
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
    
    ext = Path(file.filename).suffix.lower().strip(".")
    if ext != "pdf":
        raise HTTPException(status_code=400, detail="Unsupported file extension")

    processed = await processor.process_pdf(file_path)

    request_api_key = request.headers.get("x-openrouter-api-key")
    extracted_policy = await extractor.extract_policy_info(file_path, api_key=request_api_key)
    policy_id = str(uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    payload = {
        "policy_id": policy_id,
        "filename": file.filename,
        "file_path": file_path,
        "status": "uploaded",
        "processing": {
            "format": processed.get("format"),
            "pages": processed.get("pages"),
        },
        "extraction": extracted_policy,
        "created_at": created_at,
        "updated_at": created_at,
    }
    create_policy_record(payload)
    
    return {
        **payload,
        "message": "Policy document uploaded and extracted successfully",
    }


@router.get("/")
async def list_policies():
    """List stored policies."""
    return list_policy_records()


@router.get("/{policy_id}")
async def get_policy(policy_id: str):
    """
    Retrieve policy information
    
    Args:
        policy_id: Policy identifier
        
    Returns:
        Policy information
    """
    policy = get_policy_record(policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy


@router.delete("/{policy_id}")
async def delete_policy(policy_id: str):
    """
    Delete a policy document
    
    Args:
        policy_id: Policy identifier
        
    Returns:
        Deletion confirmation
    """
    policy = get_policy_record(policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    # Best-effort local file cleanup.
    file_path = policy.get("file_path")
    if file_path:
        try:
            Path(file_path).unlink(missing_ok=True)
        except Exception:
            pass

    delete_policy_record(policy_id)
    return {
        "policy_id": policy_id,
        "status": "deleted"
    }

"""Document ingestion and processing"""
from pathlib import Path


class DocumentProcessor:
    """Process and ingest policy documents"""
    
    def __init__(self, upload_dir: str = "./uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def process_pdf(self, file_path: str) -> dict:
        """
        Process PDF document
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Processing result metadata
        """
        return {
            "filename": Path(file_path).name,
            "format": "pdf",
            "pages": None,
            "processing_status": "saved",
        }
    
    async def save_document(self, file_content: bytes, filename: str) -> str:
        """
        Save uploaded document to disk
        
        Args:
            file_content: File content as bytes
            filename: Original filename
            
        Returns:
            Path to saved file
        """
        file_path = self.upload_dir / filename
        with open(file_path, "wb") as f:
            f.write(file_content)
        return str(file_path)
    
    def validate_file(self, filename: str, allowed_types: list) -> bool:
        """
        Validate uploaded file
        
        Args:
            filename: File to validate
            allowed_types: List of allowed file extensions
            
        Returns:
            True if valid, False otherwise
        """
        file_ext = Path(filename).suffix.lower().strip(".")
        return file_ext in allowed_types

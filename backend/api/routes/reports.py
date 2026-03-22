"""Report generation endpoints"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse

from api.core.storage import get_analysis_record
from api.modules.report_generation.generator import ReportGenerator
from api.schemas.recommendation import AnalysisResult

router = APIRouter()
generator = ReportGenerator()


@router.get("/{analysis_id}/pdf")
async def get_pdf_report(analysis_id: str):
    """
    Generate and download PDF report
    
    Args:
        analysis_id: Analysis identifier
        
    Returns:
        PDF file response
    """
    analysis_data = get_analysis_record(analysis_id)
    if not analysis_data:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis = AnalysisResult(**analysis_data)
    pdf_bytes = await generator.generate_pdf_report(analysis)
    return StreamingResponse(
        pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=policyfit-report-{analysis_id}.pdf"},
    )


@router.get("/{analysis_id}/html")
async def get_html_report(analysis_id: str):
    """
    Generate HTML report for preview
    
    Args:
        analysis_id: Analysis identifier
        
    Returns:
        HTML content
    """
    analysis_data = get_analysis_record(analysis_id)
    if not analysis_data:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis = AnalysisResult(**analysis_data)
    html_content = await generator.generate_html_report(analysis)
    return HTMLResponse(content=html_content)


@router.get("/{analysis_id}/json")
async def get_json_report(analysis_id: str):
    """
    Get report as JSON
    
    Args:
        analysis_id: Analysis identifier
        
    Returns:
        JSON report
    """
    analysis_data = get_analysis_record(analysis_id)
    if not analysis_data:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis = AnalysisResult(**analysis_data)
    report_json = await generator.generate_json_report(analysis)
    return JSONResponse(content=report_json)


@router.post("/{analysis_id}/export")
async def export_report(analysis_id: str, format: str = "pdf"):
    """
    Export report in specified format
    
    Args:
        analysis_id: Analysis identifier
        format: Export format (pdf, html, json)
        
    Returns:
        Exported report
    """
    if format not in ["pdf", "html", "json"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid format. Supported: pdf, html, json"
        )
    
    if format == "pdf":
        return await get_pdf_report(analysis_id)
    if format == "html":
        return await get_html_report(analysis_id)
    return await get_json_report(analysis_id)

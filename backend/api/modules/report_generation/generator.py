"""Generate reports in multiple formats"""
import html
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from api.schemas.recommendation import AnalysisResult


class ReportGenerator:
    """Generate comprehensive reports from analysis results"""
    
    async def generate_pdf_report(self, analysis: AnalysisResult) -> BytesIO:
        """
        Generate PDF report
        
        Args:
            analysis: Analysis result
            
        Returns:
            PDF file as BytesIO
        """
        report = BytesIO()
        doc = SimpleDocTemplate(
            report,
            pagesize=letter,
            leftMargin=0.7 * inch,
            rightMargin=0.7 * inch,
            topMargin=0.7 * inch,
            bottomMargin=0.7 * inch,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "ReportTitle",
            parent=styles["Heading1"],
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#143D59"),
            spaceAfter=12,
        )
        section_style = ParagraphStyle(
            "Section",
            parent=styles["Heading2"],
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#1F2937"),
            spaceBefore=10,
            spaceAfter=6,
        )
        body_style = ParagraphStyle(
            "Body",
            parent=styles["BodyText"],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#111827"),
        )

        story = []
        story.append(Paragraph("PolicyFit Advisor Coverage Report", title_style))

        overview_data = [
            ["Analysis ID", analysis.analysis_id],
            ["Business ID", analysis.business_id],
            ["Policy ID", analysis.policy_id],
            ["Overall Risk Score", f"{analysis.overall_risk_score:.1f}"],
        ]
        overview_table = Table(overview_data, colWidths=[1.8 * inch, 4.7 * inch])
        overview_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EFF6FF")),
                    ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#1E3A8A")),
                    ("TEXTCOLOR", (1, 0), (1, -1), colors.HexColor("#111827")),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                    ("FONTSIZE", (0, 0), (-1, -1), 9),
                    ("ALIGN", (0, 0), (0, -1), "LEFT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D1D5DB")),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        story.append(overview_table)

        story.append(Spacer(1, 12))
        story.append(Paragraph("Executive Summary", section_style))
        story.append(Paragraph(html.escape(analysis.summary or "No summary provided."), body_style))

        story.append(Paragraph("Coverage Gaps", section_style))
        if not analysis.coverage_gaps:
            story.append(Paragraph("No significant gaps identified.", body_style))
        for gap in analysis.coverage_gaps:
            text = (
                f"<b>[{html.escape(gap.severity.upper())}] {html.escape(gap.gap_type)}</b><br/>"
                f"{html.escape(gap.description)}"
            )
            story.append(Paragraph(text, body_style))
            story.append(Spacer(1, 5))

        story.append(Paragraph("Recommendations", section_style))
        if not analysis.recommendations:
            story.append(Paragraph("No specific recommendations generated.", body_style))
        for rec in analysis.recommendations:
            text = (
                f"<b>[{html.escape(rec.priority.upper())}] {html.escape(rec.coverage_type)}</b><br/>"
                f"{html.escape(rec.rationale)}"
            )
            story.append(Paragraph(text, body_style))
            if rec.estimated_cost_range:
                story.append(Paragraph(f"Estimated cost: {html.escape(rec.estimated_cost_range)}", body_style))
            story.append(Spacer(1, 5))

        doc.build(story)
        report.seek(0)
        return report
    
    async def generate_html_report(self, analysis: AnalysisResult) -> str:
        """
        Generate HTML report
        
        Args:
            analysis: Analysis result
            
        Returns:
            HTML string
        """
        gaps_html = "".join(
            f"<li><span class='badge'>{html.escape(g.severity.upper())}</span> "
            f"<strong>{html.escape(g.gap_type)}</strong><p>{html.escape(g.description)}</p></li>"
            for g in analysis.coverage_gaps
        ) or "<li>None</li>"
        recs_html = "".join(
            f"<li><span class='badge badge-priority'>{html.escape(r.priority.upper())}</span> "
            f"<strong>{html.escape(r.coverage_type)}</strong><p>{html.escape(r.rationale)}</p></li>"
            for r in analysis.recommendations
        ) or "<li>None</li>"

        html_final = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset=\"utf-8\" />
  <title>PolicyFit Report {analysis.analysis_id}</title>
  <style>
    :root {{
      --bg: #f4f7fb;
      --card: #ffffff;
      --title: #143d59;
      --text: #1f2937;
      --muted: #6b7280;
      --line: #e5e7eb;
      --accent: #2b6cb0;
      --badge-bg: #e8f1fb;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      padding: 28px;
      background: linear-gradient(180deg, #eef4ff 0%, var(--bg) 100%);
      color: var(--text);
      font-family: "Source Sans 3", "Segoe UI", sans-serif;
    }}
    .container {{ max-width: 900px; margin: 0 auto; }}
    .card {{
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 18px 20px;
      margin-bottom: 16px;
      box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
    }}
    h1 {{ margin: 0 0 10px; color: var(--title); font-size: 28px; }}
    h2 {{ margin: 0 0 10px; color: var(--accent); font-size: 18px; }}
    .meta {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }}
    .meta p {{ margin: 0; color: var(--muted); }}
    .meta strong {{ color: var(--text); }}
    ul {{ margin: 0; padding-left: 18px; }}
    li {{ margin-bottom: 10px; }}
    li p {{ margin: 4px 0 0; color: var(--muted); }}
    .badge {{
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2px;
      background: var(--badge-bg);
      color: #1e3a8a;
      margin-right: 6px;
    }}
    .footer {{ color: var(--muted); font-size: 12px; text-align: right; }}
    @media (max-width: 640px) {{
      body {{ padding: 14px; }}
      .meta {{ grid-template-columns: 1fr; }}
      h1 {{ font-size: 24px; }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>Coverage Analysis Report</h1>
      <div class="meta">
        <p><strong>Analysis ID:</strong> {html.escape(analysis.analysis_id)}</p>
        <p><strong>Business ID:</strong> {html.escape(analysis.business_id)}</p>
        <p><strong>Policy ID:</strong> {html.escape(analysis.policy_id)}</p>
        <p><strong>Overall Risk Score:</strong> {analysis.overall_risk_score}</p>
      </div>
    </div>

    <div class="card">
      <h2>Executive Summary</h2>
      <p>{html.escape(analysis.summary or "No summary provided.")}</p>
    </div>

    <div class="card">
      <h2>Coverage Gaps</h2>
      <ul>{gaps_html}</ul>
    </div>

    <div class="card">
      <h2>Recommendations</h2>
      <ul>{recs_html}</ul>
    </div>

    <div class="footer">Generated by PolicyFit Advisor</div>
  </div>
</body>
</html>
""".strip()
        return html_final
    
    async def generate_json_report(self, analysis: AnalysisResult) -> dict:
        """
        Generate JSON report
        
        Args:
            analysis: Analysis result
            
        Returns:
            Report as dictionary
        """
        return analysis.model_dump()
    
    def _format_coverage_gaps_section(self, analysis: AnalysisResult) -> str:
        """
        Format coverage gaps section
        
        Args:
            analysis: Analysis result
            
        Returns:
            Formatted section
        """
        if not analysis.coverage_gaps:
            return "None"
        return "\n".join(
            f"- [{g.severity}] {g.gap_type}: {g.description}" for g in analysis.coverage_gaps
        )
    
    def _format_recommendations_section(self, analysis: AnalysisResult) -> str:
        """
        Format recommendations section
        
        Args:
            analysis: Analysis result
            
        Returns:
            Formatted section
        """
        if not analysis.recommendations:
            return "None"
        return "\n".join(
            f"- [{r.priority}] {r.coverage_type}: {r.rationale}" for r in analysis.recommendations
        )
    
    def _format_executive_summary(self, analysis: AnalysisResult) -> str:
        """
        Format executive summary
        
        Args:
            analysis: Analysis result
            
        Returns:
            Executive summary
        """
        return analysis.summary

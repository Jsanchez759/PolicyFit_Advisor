import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/store'
import { reportService } from '../services/api'
import './Export.css'

function Export() {
  const navigate = useNavigate()
  const analysisId = useStore((state) => state.analysisId)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setError = useStore((state) => state.setError)

  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('')

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  }

  const handleExport = async () => {
    if (!analysisId) {
      setError('No analysis available for export')
      return
    }

    try {
      setExporting(true)
      setIsLoading(true)
      setExportStatus('')

      let response
      switch (selectedFormat) {
        case 'pdf': {
          response = await reportService.getPdfReport(analysisId)
          downloadBlob(response.data, `policy-analysis-${analysisId}.pdf`)
          break
        }

        case 'html': {
          response = await reportService.getHtmlReport(analysisId)
          downloadBlob(new Blob([response.data], { type: 'text/html' }), `policy-analysis-${analysisId}.html`)
          break
        }

        case 'json': {
          response = await reportService.getJsonReport(analysisId)
          const json = JSON.stringify(response.data, null, 2)
          downloadBlob(new Blob([json], { type: 'application/json' }), `policy-analysis-${analysisId}.json`)
          break
        }

        default:
          break
      }

      setError(null)
      setExportStatus('Your report download is ready.')
    } catch (err) {
      setError(`Failed to export ${selectedFormat} report`)
      setExportStatus('Could not download the report. Check the analysis service and try again.')
      console.error('Export error:', err)
    } finally {
      setExporting(false)
      setIsLoading(false)
    }
  }

  if (!analysisId) {
    return (
      <div className="export-error">
        <h2>No analysis available</h2>
        <p>Please complete the analysis first.</p>
        <button onClick={() => navigate('/upload')} className="back-button">
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="export-page">
      <div className="export-container">
        <h1>Export Your Report</h1>
        <p className="export-subtitle">
          Download your analysis report in your preferred format
        </p>

        <div className="format-selection">
          <h2>Select Export Format</h2>

          <div className="format-options">
            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={selectedFormat === 'pdf'}
                onChange={(e) => setSelectedFormat(e.target.value)}
              />
              <div className="format-info">
                <div className="format-icon">PDF</div>
                <div>
                  <div className="format-name">PDF Report</div>
                  <div className="format-desc">
                    Professional formatted report, print-ready
                  </div>
                </div>
              </div>
            </label>

            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="html"
                checked={selectedFormat === 'html'}
                onChange={(e) => setSelectedFormat(e.target.value)}
              />
              <div className="format-info">
                <div className="format-icon">HTML</div>
                <div>
                  <div className="format-name">HTML Report</div>
                  <div className="format-desc">
                    Interactive report for web viewing
                  </div>
                </div>
              </div>
            </label>

            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="json"
                checked={selectedFormat === 'json'}
                onChange={(e) => setSelectedFormat(e.target.value)}
              />
              <div className="format-info">
                <div className="format-icon">{'{}'}</div>
                <div>
                  <div className="format-name">JSON Data</div>
                  <div className="format-desc">
                    Structured data for integration
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="export-preview">
          <h3>What&apos;s included:</h3>
          <ul>
            <li>Executive Summary</li>
            <li>Coverage Gaps Analysis</li>
            <li>Detailed Recommendations</li>
            <li>Risk Assessment</li>
            <li>Business Profile</li>
            <li>Policy Analysis</li>
          </ul>
        </div>

        <div className="export-actions">
          {exportStatus && <p className="export-status" role="status">{exportStatus}</p>}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="export-button primary"
          >
            {exporting ? 'Exporting...' : `Download ${selectedFormat.toUpperCase()}`}
          </button>
          <button
            onClick={() => navigate('/recommendations')}
            className="export-button secondary"
          >
            Back to Recommendations
          </button>
        </div>
      </div>
    </div>
  )
}

export default Export

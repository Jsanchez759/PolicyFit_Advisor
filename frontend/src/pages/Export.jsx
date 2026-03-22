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

  const handleExport = async () => {
    if (!analysisId) {
      setError('No analysis available for export')
      return
    }

    try {
      setExporting(true)
      setIsLoading(true)

      let response
      switch (selectedFormat) {
        case 'pdf':
          response = await reportService.getPdfReport(analysisId)
          // Trigger download
          const url = window.URL.createObjectURL(response.data)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `policy-analysis-${analysisId}.pdf`)
          document.body.appendChild(link)
          link.click()
          link.parentElement.removeChild(link)
          window.URL.revokeObjectURL(url)
          break

        case 'html':
          response = await reportService.getHtmlReport(analysisId)
          // Open HTML in new window or download
          const htmlWindow = window.open()
          if (htmlWindow) {
            htmlWindow.document.write(response.data)
          }
          break

        case 'json':
          response = await reportService.getJsonReport(analysisId)
          const json = JSON.stringify(response.data, null, 2)
          const element = document.createElement('a')
          element.setAttribute(
            'href',
            'data:text/plain;charset=utf-8,' + encodeURIComponent(json)
          )
          element.setAttribute('download', `policy-analysis-${analysisId}.json`)
          element.style.display = 'none'
          document.body.appendChild(element)
          element.click()
          document.body.removeChild(element)
          break

        default:
          break
      }

      setError(null)
    } catch (err) {
      setError(`Failed to export ${selectedFormat} report`)
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
                <div className="format-icon">📄</div>
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
                <div className="format-icon">🌐</div>
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
                <div className="format-icon">{ }</div>
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
          <h3>What's included:</h3>
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

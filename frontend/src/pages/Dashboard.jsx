import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/store'
import { useFetch } from '../hooks/useFetch'
import { recommendationService } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const analysisId = useStore((state) => state.analysisId)
  const analysisResults = useStore((state) => state.analysisResults)
  const setAnalysisResults = useStore((state) => state.setAnalysisResults)

  const { data, loading, error } = useFetch(
    () => analysisId ? recommendationService.getAnalysis(analysisId) : null,
    [analysisId]
  )

  useEffect(() => {
    if (data) {
      setAnalysisResults(data)
    }
  }, [data, setAnalysisResults])

  if (!analysisId) {
    return (
      <div className="dashboard-error">
        <h2>No analysis found</h2>
        <p>Please upload a policy and provide business details first.</p>
        <button onClick={() => navigate('/upload')} className="back-button">
          Start Over
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Analyzing your policy...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error loading analysis</h2>
        <p>{error.message}</p>
        <button onClick={() => navigate('/upload')} className="back-button">
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Analysis Dashboard</h1>
        <p>Your Insurance Coverage Analysis</p>
      </div>

      <div className="dashboard-grid">
        <div className="risk-card">
          <h3>Overall Risk Score</h3>
          <div className="risk-score">
            {analysisResults?.overall_risk_score || 0}%
          </div>
          <p className="risk-label">Risk Level</p>
        </div>

        <div className="stats-card">
          <h3>Coverage Gaps</h3>
          <div className="stat-number">
            {analysisResults?.coverage_gaps?.length || 0}
          </div>
          <p>Issues identified</p>
        </div>

        <div className="stats-card">
          <h3>Recommendations</h3>
          <div className="stat-number">
            {analysisResults?.recommendations?.length || 0}
          </div>
          <p>Coverage recommendations</p>
        </div>
      </div>

      <div className="summary-section">
        <h2>Executive Summary</h2>
        <div className="summary-content">
          {analysisResults?.summary || 'Analysis in progress...'}
        </div>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => navigate('/recommendations')}
          className="action-button primary"
        >
          View Detailed Recommendations
        </button>
        <button
          onClick={() => navigate('/export')}
          className="action-button secondary"
        >
          Export Report
        </button>
      </div>
    </div>
  )
}

export default Dashboard

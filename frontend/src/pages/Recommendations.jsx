import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/store'
import './Recommendations.css'

function Recommendations() {
  const navigate = useNavigate()
  const analysisResults = useStore((state) => state.analysisResults)

  if (!analysisResults) {
    return (
      <div className="recommendations-error">
        <h2>No recommendations available</h2>
        <button onClick={() => navigate('/upload')} className="back-button">
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <h1>Coverage Recommendations</h1>
        <p>Tailored recommendations for your business</p>
      </div>

      <div className="recommendations-content">
        <section className="gaps-section">
          <h2>Coverage Gaps Identified</h2>
          <div className="gaps-list">
            {analysisResults.coverage_gaps && analysisResults.coverage_gaps.length > 0 ? (
              analysisResults.coverage_gaps.map((gap, index) => (
                <div key={index} className={`gap-card severity-${gap.severity}`}>
                  <div className="gap-header">
                    <h3>{gap.gap_type}</h3>
                    <span className={`severity-badge ${gap.severity}`}>
                      {gap.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="gap-description">{gap.description}</p>
                  {gap.affected_areas && gap.affected_areas.length > 0 && (
                    <div className="affected-areas">
                      <strong>Affected areas:</strong>
                      <ul>
                        {gap.affected_areas.map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No coverage gaps identified.</p>
            )}
          </div>
        </section>

        <section className="recommendations-section">
          <h2>Recommended Coverage</h2>
          <div className="recommendations-list">
            {analysisResults.recommendations && analysisResults.recommendations.length > 0 ? (
              analysisResults.recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                  <div className="rec-header">
                    <h3>{rec.coverage_type}</h3>
                    <span className={`priority-badge ${rec.priority}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="rec-rationale">{rec.rationale}</p>
                  {rec.estimated_cost_range && (
                    <div className="cost-info">
                      <strong>Estimated Cost:</strong> {rec.estimated_cost_range}
                    </div>
                  )}
                  {rec.affected_business_areas && rec.affected_business_areas.length > 0 && (
                    <div className="business-areas">
                      <strong>Applicable to:</strong>
                      <ul>
                        {rec.affected_business_areas.map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No recommendations available.</p>
            )}
          </div>
        </section>
      </div>

      <div className="recommendations-actions">
        <button onClick={() => navigate('/dashboard')} className="action-button">
          Back to Dashboard
        </button>
        <button onClick={() => navigate('/export')} className="action-button primary">
          Export Full Report
        </button>
      </div>
    </div>
  )
}

export default Recommendations

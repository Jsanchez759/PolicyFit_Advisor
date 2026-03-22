import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../context/store'
import './Landing.css'

function Landing() {
  const savedKey = useStore((state) => state.openRouterApiKey)
  const setOpenRouterApiKey = useStore((state) => state.setOpenRouterApiKey)
  const [keyInput, setKeyInput] = useState(savedKey)

  const handleSaveKey = () => {
    setOpenRouterApiKey((keyInput || '').trim())
  }

  return (
    <div className="landing-page">
      <section className="api-key-panel">
        <div className="api-key-title-row">
          <h3>OpenRouter API Key</h3>
          <div className="api-key-help" aria-label="About API key" tabIndex={0}>
            ?
            <div className="api-key-popover">
              <p><strong>Why we ask for this key</strong></p>
              <p>
                The backend uses OpenRouter to extract policy data and generate recommendations.
                Your key is sent with your requests so the analysis can run.
              </p>
              <p><strong>How to get it</strong></p>
              <p>
                Create/sign in to your OpenRouter account, then generate an API key in the
                OpenRouter dashboard and paste it here.
              </p>
              <p><strong>Cost note</strong></p>
              <p>
                This backend is configured to use OpenRouter free models by default,
                so normal usage should not generate charges.
              </p>
            </div>
          </div>
        </div>
        <p>Enter your key to run extraction and recommendations from this browser session.</p>
        <div className="api-key-row">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="sk-or-v1-..."
          />
          <button type="button" onClick={handleSaveKey}>Save Key</button>
        </div>
      </section>

      <section className="hero">
        <div className="hero-content">
          <h1>PolicyFit Advisor</h1>
          <p>AI-Powered Insurance Coverage Analysis & Recommendations</p>
          <p className="subtitle">
            Identify coverage gaps and get tailored recommendations for your business
          </p>
          <Link to="/upload" className="cta-button">
            Get Started
          </Link>
          <Link to="/workspace" className="cta-button ghost">
            Open Workspace
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">1</div>
            <h3>Upload Policy</h3>
            <p>Upload your commercial insurance policy (PDF)</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">2</div>
            <h3>Business Details</h3>
            <p>Provide your business information and operations details</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">3</div>
            <h3>AI Analysis</h3>
            <p>Our AI analyzes your policy against your business profile</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">4</div>
            <h3>Get Recommendations</h3>
            <p>Receive tailored coverage recommendations</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">5</div>
            <h3>Export Report</h3>
            <p>Download comprehensive reports in PDF or other formats</p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h2>Why PolicyFit Advisor?</h2>
        <ul className="benefits-list">
          <li>✓ AI-powered policy analysis</li>
          <li>✓ Comprehensive coverage gap identification</li>
          <li>✓ Tailored recommendations for your business</li>
          <li>✓ Easy-to-understand reports</li>
          <li>✓ Fast and accurate analysis</li>
        </ul>
      </section>

      <section className="cta-section">
        <h2>Ready to optimize your insurance coverage?</h2>
        <Link to="/upload" className="cta-button-large">
          Start Analysis Now
        </Link>
      </section>
    </div>
  )
}

export default Landing

import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
  return (
    <div className="landing-page">
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
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">1</div>
            <h3>Upload Policy</h3>
            <p>Upload your commercial insurance policy (PDF or DOCX)</p>
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

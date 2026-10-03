import { Link } from 'react-router-dom'
import './Landing.css'

const steps = [
  { title: 'Read the policy', detail: 'Upload the PDF you want to assess.' },
  { title: 'Describe the business', detail: 'Add the operations your coverage needs to protect.' },
  { title: 'See the gaps', detail: 'Review findings, recommendations, and a report you can share.' },
]

function Landing() {
  return (
    <div className="landing-page">
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-context">Commercial insurance, made easier to review</p>
          <h1 id="hero-title">Know where your policy stands.</h1>
          <p className="hero-description">Bring your policy and business details together. PolicyFit highlights possible coverage gaps and gives you a clearer place to start the conversation.</p>
          <div className="hero-actions">
            <Link to="/upload" className="button button-primary">Start an analysis</Link>
            <Link to="/workspace" className="button button-outline">Open workspace</Link>
          </div>
          <p className="hero-note">Have a PDF ready? The analysis starts with your policy.</p>
        </div>
        <div className="coverage-graphic" aria-label="Illustration of a policy being checked against business needs" role="img">
          <div className="graphic-top"><span>Coverage review</span><span className="graphic-symbol">✳</span></div>
          <div className="graphic-line graphic-line-long" />
          <div className="graphic-line graphic-line-short" />
          <div className="graphic-divider" />
          <div className="graphic-row"><span className="graphic-check">✓</span><span>What your policy covers</span><span className="graphic-meter meter-full" /></div>
          <div className="graphic-row"><span className="graphic-check">✓</span><span>Where your business operates</span><span className="graphic-meter meter-mid" /></div>
          <div className="graphic-row graphic-row-gap"><span className="graphic-alert">!</span><span>What needs a closer look</span><span className="graphic-meter meter-gap" /></div>
          <div className="graphic-caption">A clearer view of your coverage</div>
        </div>
      </section>

      <section className="landing-process" aria-labelledby="process-title">
        <div className="section-intro">
          <h2 id="process-title">From policy to a practical next step.</h2>
          <p>One guided flow keeps the document, business context, and findings connected.</p>
        </div>
        <ol className="process-list">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="process-number">0{index + 1}</span>
              <div><h3>{step.title}</h3><p>{step.detail}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="landing-close">
        <div><h2>Start with the policy you have.</h2><p>Review the details, then decide what deserves a second look.</p></div>
        <Link to="/upload" className="button button-light">Upload a policy</Link>
      </section>
    </div>
  )
}

export default Landing

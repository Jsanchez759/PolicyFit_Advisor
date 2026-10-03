import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../context/store'
import './Layout.css'

const stages = [
  { path: '/upload', label: 'Policy' },
  { path: '/intake-form', label: 'Business' },
  { path: '/dashboard', label: 'Review' },
  { path: '/recommendations', label: 'Recommendations' },
  { path: '/export', label: 'Export' },
]

function Layout({ children }) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const savedKey = useStore((state) => state.openRouterApiKey)
  const setOpenRouterApiKey = useStore((state) => state.setOpenRouterApiKey)
  const [keyInput, setKeyInput] = useState(savedKey)
  const [keySaved, setKeySaved] = useState(false)
  const currentStage = stages.findIndex((stage) => stage.path === pathname)

  const saveKey = (event) => {
    event.preventDefault()
    setOpenRouterApiKey(keyInput.trim())
    setKeySaved(true)
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)} aria-label="PolicyFit home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>PolicyFit<span className="brand-light"> Advisor</span></span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <nav id="main-navigation" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>Overview</NavLink>
            <NavLink to="/upload" onClick={() => setMenuOpen(false)}>New analysis</NavLink>
            <NavLink to="/workspace" onClick={() => setMenuOpen(false)}>Workspace</NavLink>
            <button type="button" className="settings-trigger" onClick={() => { setSettingsOpen(true); setMenuOpen(false); setKeySaved(false) }}>
              Settings<span className={`key-indicator ${savedKey ? 'is-set' : ''}`} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      {currentStage >= 0 && (
        <nav className="stage-nav" aria-label="Analysis progress">
          <ol>
            {stages.map((stage, index) => (
              <li key={stage.path} className={index === currentStage ? 'is-current' : ''}>
                <span className="stage-number">{index + 1}</span>
                <span>{stage.label}</span>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <main id="main-content" className="main-content">{children}</main>
      <footer className="site-footer">
        <span>PolicyFit Advisor</span>
        <span>Clearer coverage decisions start with a closer look.</span>
      </footer>

      {settingsOpen && (
        <div className="settings-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false) }}>
          <section className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title" onKeyDown={(event) => { if (event.key === 'Escape') setSettingsOpen(false) }}>
            <div className="settings-heading">
              <div>
                <h2 id="settings-title">Analysis settings</h2>
                <p>Add an OpenRouter key if the analysis service does not have one configured.</p>
              </div>
              <button type="button" className="settings-close" aria-label="Close settings" onClick={() => setSettingsOpen(false)}>×</button>
            </div>
            <form onSubmit={saveKey}>
              <label htmlFor="openrouter-key">OpenRouter API key</label>
              <input id="openrouter-key" type="password" autoComplete="off" autoFocus value={keyInput} onChange={(event) => { setKeyInput(event.target.value); setKeySaved(false) }} placeholder="sk-or-v1-..." />
              <p className="settings-help">The key is kept in this browser session and sent to the app backend with analysis requests.</p>
              <button type="submit" className="button button-primary">Save key</button>
              {keySaved && <p className="settings-success" role="status">Key saved for this session.</p>}
            </form>
          </section>
        </div>
      )}
    </>
  )
}

export default Layout

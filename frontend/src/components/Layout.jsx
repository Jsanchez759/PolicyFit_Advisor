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
  const currentStage = stages.findIndex((stage) => stage.path === pathname)

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

    </>
  )
}

export default Layout

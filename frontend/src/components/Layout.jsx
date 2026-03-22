import { Link } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
  return (
    <>
      <header className="header">
        <nav className="navbar">
          <Link to="/" className="logo">
            PolicyFit Advisor
          </Link>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/intake-form">Form</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2024 PolicyFit Advisor. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Layout

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import IntakeForm from './pages/IntakeForm'
import Dashboard from './pages/Dashboard'
import Recommendations from './pages/Recommendations'
import Export from './pages/Export'
import Workspace from './pages/Workspace'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/intake-form" element={<IntakeForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/export" element={<Export />} />
          <Route path="/workspace" element={<Workspace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

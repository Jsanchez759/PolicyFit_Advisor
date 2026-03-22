import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/store'
import { businessService, policyService, recommendationService } from '../services/api'
import './Workspace.css'

function Workspace() {
  const navigate = useNavigate()
  const setBusinessId = useStore((state) => state.setBusinessId)
  const setPolicyId = useStore((state) => state.setPolicyId)
  const setAnalysisId = useStore((state) => state.setAnalysisId)
  const setAnalysisResults = useStore((state) => state.setAnalysisResults)
  const setError = useStore((state) => state.setError)

  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [businesses, setBusinesses] = useState([])
  const [policies, setPolicies] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [openChatFor, setOpenChatFor] = useState('')
  const [chatByAnalysis, setChatByAnalysis] = useState({})
  const [chatInputByAnalysis, setChatInputByAnalysis] = useState({})
  const [sendingChatFor, setSendingChatFor] = useState('')
  const chatScrollRefs = useRef({})

  const escapeHtml = (value) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

  const renderMarkdown = (raw) => {
    if (!raw) return ''
    let html = escapeHtml(raw)

    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    html = html.replace(/^###\s(.+)$/gm, '<h5>$1</h5>')
    html = html.replace(/^##\s(.+)$/gm, '<h4>$1</h4>')
    html = html.replace(/^#\s(.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    html = html.replace(/^-\s(.+)$/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    html = html.replace(/\n/g, '<br/>')
    return html
  }

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true)
        const [bRes, pRes, aRes] = await Promise.all([
          businessService.list(),
          policyService.list(),
          recommendationService.list(),
        ])
        setBusinesses(bRes.data || [])
        setPolicies(pRes.data || [])
        setAnalyses(aRes.data || [])
      } catch (err) {
        setError('Failed to load workspace data')
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [refreshKey, setError])

  useEffect(() => {
    if (!openChatFor) return
    const node = chatScrollRefs.current[openChatFor]
    if (node) {
      node.scrollTop = node.scrollHeight
    }
  }, [chatByAnalysis, openChatFor])

  const openAnalysis = async (analysisId, destination = '/dashboard') => {
    try {
      const res = await recommendationService.getAnalysis(analysisId)
      setAnalysisId(analysisId)
      setBusinessId(res.data.business_id)
      setPolicyId(res.data.policy_id)
      setAnalysisResults(res.data)
      navigate(destination)
    } catch {
      setError('Could not open selected analysis')
    }
  }

  const handleDeleteAnalysis = async (analysisId) => {
    await recommendationService.delete(analysisId)
    setRefreshKey((v) => v + 1)
  }

  const handleDeleteBusiness = async (businessId) => {
    await businessService.delete(businessId)
    setRefreshKey((v) => v + 1)
  }

  const handleDeletePolicy = async (policyId) => {
    await policyService.deletePolicy(policyId)
    setRefreshKey((v) => v + 1)
  }

  const toggleChat = async (analysisId) => {
    if (openChatFor === analysisId) {
      setOpenChatFor('')
      return
    }
    setOpenChatFor(analysisId)
    if (!chatByAnalysis[analysisId]) {
      try {
        const res = await recommendationService.getChat(analysisId)
        setChatByAnalysis((prev) => ({ ...prev, [analysisId]: res.data.messages || [] }))
      } catch {
        setError('Could not load analysis chat')
      }
    }
  }

  const sendChat = async (analysisId) => {
    const text = (chatInputByAnalysis[analysisId] || '').trim()
    if (!text) return

    try {
      setSendingChatFor(analysisId)
      const res = await recommendationService.sendChat(analysisId, text)
      setChatByAnalysis((prev) => ({ ...prev, [analysisId]: res.data.messages || [] }))
      setChatInputByAnalysis((prev) => ({ ...prev, [analysisId]: '' }))
    } catch {
      setError('Chat request failed for this analysis')
    } finally {
      setSendingChatFor('')
    }
  }

  if (loading) {
    return (
      <div className="workspace-loading">
        <div className="spinner" />
        <p>Loading workspace...</p>
      </div>
    )
  }

  return (
    <div className="workspace-page">
      <div className="workspace-header">
        <h1>Workspace</h1>
        <p>Manage previous analyses, businesses, and uploaded policies.</p>
      </div>

      <section className="workspace-section">
        <div className="section-title-row">
          <h2>Analyses ({analyses.length})</h2>
          <button onClick={() => navigate('/upload')} className="small-btn primary">New Analysis</button>
        </div>
        {analyses.length === 0 ? (
          <p className="empty-text">No analyses yet.</p>
        ) : (
          <div className="card-list">
            {analyses.map((item) => (
              <article key={item.analysis_id} className="workspace-card">
                <div>
                  <h3>{item.analysis_id}</h3>
                  <p>Business: {item.business_id}</p>
                  <p>Policy: {item.policy_id}</p>
                  <p>Risk: {item.overall_risk_score}</p>
                </div>
                <div className="card-actions">
                  <button className="small-btn" onClick={() => openAnalysis(item.analysis_id, '/dashboard')}>Open</button>
                  <button className="small-btn" onClick={() => openAnalysis(item.analysis_id, '/recommendations')}>Recommendations</button>
                  <button className="small-btn" onClick={() => openAnalysis(item.analysis_id, '/export')}>Export</button>
                  <button className="small-btn" onClick={() => toggleChat(item.analysis_id)}>Chat</button>
                  <button className="small-btn danger" onClick={() => handleDeleteAnalysis(item.analysis_id)}>Delete</button>
                </div>

                {openChatFor === item.analysis_id && (
                  <div className="analysis-chat">
                    <div
                      className="chat-messages"
                      ref={(el) => {
                        if (el) chatScrollRefs.current[item.analysis_id] = el
                      }}
                    >
                      {(chatByAnalysis[item.analysis_id] || []).length === 0 ? (
                        <p className="empty-text">No messages yet. Ask anything about this analysis.</p>
                      ) : (
                        (chatByAnalysis[item.analysis_id] || []).map((m, idx) => (
                          <div key={`${item.analysis_id}-${idx}`} className={`chat-msg ${m.role}`}>
                            <span className="chat-role">{m.role === 'assistant' ? 'Assistant' : 'You'}</span>
                            <div
                              className="chat-md"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content || '') }}
                            />
                          </div>
                        ))
                      )}
                    </div>

                    <div className="chat-input-row">
                      <input
                        type="text"
                        placeholder="Ask about this analysis..."
                        value={chatInputByAnalysis[item.analysis_id] || ''}
                        onChange={(e) =>
                          setChatInputByAnalysis((prev) => ({
                            ...prev,
                            [item.analysis_id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') sendChat(item.analysis_id)
                        }}
                      />
                      <button
                        className="small-btn primary"
                        onClick={() => sendChat(item.analysis_id)}
                        disabled={sendingChatFor === item.analysis_id}
                      >
                        {sendingChatFor === item.analysis_id ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="workspace-section">
        <h2>Businesses ({businesses.length})</h2>
        {businesses.length === 0 ? (
          <p className="empty-text">No businesses stored.</p>
        ) : (
          <div className="card-list">
            {businesses.map((item) => (
              <article key={item.id} className="workspace-card compact">
                <div>
                  <h3>{item.company_name}</h3>
                  <p>ID: {item.id}</p>
                  <p>NAICS: {item.naics_code}</p>
                  <p>Employees: {item.employees}</p>
                </div>
                <div className="card-actions">
                  <button className="small-btn danger" onClick={() => handleDeleteBusiness(item.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="workspace-section">
        <h2>Policies ({policies.length})</h2>
        {policies.length === 0 ? (
          <p className="empty-text">No policies uploaded.</p>
        ) : (
          <div className="card-list">
            {policies.map((item) => (
              <article key={item.policy_id} className="workspace-card compact">
                <div>
                  <h3>{item.filename}</h3>
                  <p>ID: {item.policy_id}</p>
                  <p>Uploaded: {item.created_at ? new Date(item.created_at).toLocaleString() : 'n/a'}</p>
                </div>
                <div className="card-actions">
                  <button className="small-btn danger" onClick={() => handleDeletePolicy(item.policy_id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Workspace

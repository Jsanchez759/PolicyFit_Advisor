import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/store'
import { policyService } from '../services/api'
import './Upload.css'

function Upload() {
  const navigate = useNavigate()
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setError = useStore((state) => state.setError)
  const setPolicyId = useStore((state) => state.setPolicyId)

  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('idle')

  const selectFile = (selectedFile) => {
    if (!selectedFile) return
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setFile(null)
      setStatusType('error')
      setStatusMessage('Choose a PDF document to continue.')
      return
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      setFile(null)
      setStatusType('error')
      setStatusMessage('This file is over 50 MB. Choose a smaller PDF.')
      return
    }
    setFile(selectedFile)
    setStatusType('idle')
    setStatusMessage('')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setStatusType('error')
      setStatusMessage('Choose a PDF document to continue.')
      return
    }
    try {
      setIsUploading(true)
      setIsLoading(true)
      setStatusType('loading')
      setStatusMessage('Uploading policy document...')

      const response = await policyService.upload(file)
      setStatusMessage('Extracting policy details and validating coverage...')

      setPolicyId(response.data.policy_id)
      setStatusType('success')
      setStatusMessage('Policy processed successfully. Continuing to business form...')
      setError(null)
      setTimeout(() => navigate('/intake-form'), 800)
    } catch (err) {
      setStatusType('error')
      setStatusMessage(err.response?.data?.detail || 'Upload failed. Check that the backend is running and try again.')
      setError('Failed to upload policy. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-container">
        <p className="page-context">Start a new analysis</p>
        <h1>First, add your policy.</h1>
        <p className="upload-subtitle">
          Choose the commercial insurance policy you want to review. We will read it alongside your business details.
        </p>

        <form onSubmit={handleUpload} className="upload-form">
          <div className={`file-upload-area ${isDragging ? 'is-dragging' : ''}`}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => { event.preventDefault(); setIsDragging(false); selectFile(event.dataTransfer.files[0]) }}
          >
            <input
              type="file"
              id="file-input"
              onChange={(event) => selectFile(event.target.files[0])}
              accept=".pdf,application/pdf"
              className="file-input"
              disabled={isUploading}
            />
            <label htmlFor="file-input" className="file-label">
              <span className="upload-symbol" aria-hidden="true">↥</span>
              <strong>Choose a PDF or drop it here</strong>
              <span>Maximum file size: 50 MB</span>
            </label>
          </div>

          {file && (
            <div className="file-selected">
              <p>
                <strong>Selected file:</strong> {file.name}
              </p>
              <p className="file-size">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          {statusType !== 'idle' && (
            <div className={`status-message status-${statusType}`} role="status">
              {statusType === 'loading' && <span className="status-spinner" aria-hidden="true" />}
              <span>{statusMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="upload-button"
            disabled={!file || isUploading}
          >
            {isUploading ? 'Reading policy...' : 'Continue with this policy'}
          </button>
        </form>

        <div className="upload-info">
          <h3>After you upload</h3>
          <p>We will ask about your business, then compare its operations with the coverage found in your policy.</p>
        </div>
      </div>
    </div>
  )
}

export default Upload

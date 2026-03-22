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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('idle')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadProgress(0)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    try {
      setIsUploading(true)
      setIsLoading(true)
      setStatusType('loading')
      setStatusMessage('Uploading policy document...')
      setUploadProgress(20)

      const response = await policyService.upload(file)
      setUploadProgress(75)
      setStatusMessage('Extracting policy details and validating coverage...')

      setPolicyId(response.data.policy_id)
      setUploadProgress(100)
      setStatusType('success')
      setStatusMessage('Policy processed successfully. Continuing to business form...')
      setError(null)
      setTimeout(() => navigate('/intake-form'), 800)
    } catch (err) {
      setStatusType('error')
      setStatusMessage('Upload failed. Please verify your PDF and try again.')
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
        <h1>Upload Your Insurance Policy</h1>
        <p className="upload-subtitle">
          Upload your commercial insurance policy document (PDF only)
        </p>

        <form onSubmit={handleUpload} className="upload-form">
          <div className="file-upload-area">
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              accept=".pdf"
              className="file-input"
              disabled={isUploading}
            />
            <label htmlFor="file-input" className="file-label">
              <div className="upload-icon">📄</div>
              <p>Click to select or drag and drop</p>
              <p className="file-types">Supported: PDF</p>
              <p className="max-size">Maximum file size: 50MB</p>
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

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {statusType !== 'idle' && (
            <div className={`status-message status-${statusType}`}>
              {statusType === 'loading' && <span className="status-spinner" aria-hidden="true" />}
              <span>{statusMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="upload-button"
            disabled={!file || isUploading}
          >
            {isUploading ? 'Processing Policy...' : 'Upload Policy'}
          </button>
        </form>

        <div className="upload-info">
          <h3>What happens next?</h3>
          <ol>
            <li>Your policy document will be analyzed by our AI</li>
            <li>We'll extract key coverage information</li>
            <li>You'll provide your business details</li>
            <li>We'll identify coverage gaps and recommendations</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Upload

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/store'
import { businessService, recommendationService } from '../services/api'
import { useForm } from '../hooks/useForm'
import './IntakeForm.css'

function IntakeForm() {
  const navigate = useNavigate()
  const policyId = useStore((state) => state.policyId)
  const setBusinessId = useStore((state) => state.setBusinessId)
  const setAnalysisId = useStore((state) => state.setAnalysisId)
  const setAnalysisResults = useStore((state) => state.setAnalysisResults)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setError = useStore((state) => state.setError)

  const initialValues = {
    company_name: '',
    naics_code: '',
    employees: 0,
    annual_revenue: '',
    products: [],
    operations: [],
    locations: [],
  }

  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedOperations, setSelectedOperations] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('idle')

  const handleSubmit = async (values) => {
    if (!policyId) {
      setError('Please upload a policy first.')
      navigate('/upload')
      return
    }

    try {
      setIsProcessing(true)
      setIsLoading(true)
      setStatusType('loading')
      setStatusMessage('Saving business profile...')

      const payload = {
        ...values,
        annual_revenue: values.annual_revenue === '' ? null : Number(values.annual_revenue),
        employees: Number(values.employees || 0),
        products: selectedProducts,
        operations: selectedOperations,
      }

      const businessResponse = await businessService.create(payload)
      const businessId = businessResponse.data.id
      setBusinessId(businessId)

      setStatusMessage('Running coverage analysis and generating recommendations...')
      const analysisResponse = await recommendationService.analyze({
        business_id: businessId,
        policy_id: policyId,
      })

      setAnalysisId(analysisResponse.data.analysis_id)
      setAnalysisResults(analysisResponse.data)
      setStatusType('success')
      setStatusMessage('Analysis completed successfully. Opening dashboard...')
      setError(null)

      setTimeout(() => navigate('/dashboard'), 900)
    } catch (err) {
      setStatusType('error')
      setStatusMessage('Analysis failed. Please review your information and try again.')
      setError('Failed to process your information. Please try again.')
      console.error('Form error:', err)
    } finally {
      setIsProcessing(false)
      setIsLoading(false)
    }
  }

  const { values, handleChange, handleBlur, handleSubmit: onSubmit } = useForm(
    initialValues,
    handleSubmit
  )

  const commonProducts = [
    'Manufacturing',
    'Retail',
    'Services',
    'Software',
    'Food & Beverage',
    'Healthcare',
  ]

  const commonOperations = [
    'Online',
    'Physical Store',
    'Mobile/Field',
    'Warehouse',
    'Office',
    'Remote',
  ]

  return (
    <div className="intake-form-page">
      <div className="form-container">
        <h1>Business Information</h1>
        <p className="form-subtitle">
          Provide your business details so we can generate tailored recommendations
        </p>

        <form onSubmit={onSubmit} className="intake-form">
          {statusType !== 'idle' && (
            <div className={`status-message status-${statusType}`}>
              {statusType === 'loading' && <span className="status-spinner" aria-hidden="true" />}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="company_name">Company Name *</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={values.company_name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={isProcessing}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="naics_code">NAICS Code *</label>
              <input
                type="text"
                id="naics_code"
                name="naics_code"
                value={values.naics_code}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., 339110"
                pattern="\d{6}"
                required
                disabled={isProcessing}
              />
              <small>6-digit industry classification code</small>
            </div>

            <div className="form-group">
              <label htmlFor="employees">Number of Employees *</label>
              <input
                type="number"
                id="employees"
                name="employees"
                value={values.employees}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="annual_revenue">Annual Revenue</label>
            <input
              type="number"
              id="annual_revenue"
              name="annual_revenue"
              value={values.annual_revenue}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., 1000000"
              disabled={isProcessing}
            />
          </div>

          <div className="form-group">
            <label>Products/Services *</label>
            <div className="checkbox-group">
              {commonProducts.map((product) => (
                <label key={product} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={product}
                    checked={selectedProducts.includes(product)}
                    disabled={isProcessing}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, product])
                      } else {
                        setSelectedProducts(selectedProducts.filter((p) => p !== product))
                      }
                    }}
                  />
                  {product}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Operations *</label>
            <div className="checkbox-group">
              {commonOperations.map((operation) => (
                <label key={operation} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={operation}
                    checked={selectedOperations.includes(operation)}
                    disabled={isProcessing}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOperations([...selectedOperations, operation])
                      } else {
                        setSelectedOperations(selectedOperations.filter((o) => o !== operation))
                      }
                    }}
                  />
                  {operation}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Analyze & Get Recommendations'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default IntakeForm

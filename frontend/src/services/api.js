import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Policy endpoints
export const policyService = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/policies/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getPolicy: (policyId) => api.get(`/policies/${policyId}`),
  deletePolicy: (policyId) => api.delete(`/policies/${policyId}`),
}

// Business endpoints
export const businessService = {
  create: (businessData) => api.post('/business', businessData),
  get: (businessId) => api.get(`/business/${businessId}`),
  update: (businessId, businessData) => api.put(`/business/${businessId}`, businessData),
  delete: (businessId) => api.delete(`/business/${businessId}`),
}

// Recommendation endpoints
export const recommendationService = {
  analyze: (analysisRequest) => api.post('/recommendations/analyze', analysisRequest),
  getAnalysis: (analysisId) => api.get(`/recommendations/${analysisId}`),
}

// Report endpoints
export const reportService = {
  getPdfReport: (analysisId) => api.get(`/reports/${analysisId}/pdf`, { responseType: 'blob' }),
  getHtmlReport: (analysisId) => api.get(`/reports/${analysisId}/html`),
  getJsonReport: (analysisId) => api.get(`/reports/${analysisId}/json`),
  exportReport: (analysisId, format) => api.post(`/reports/${analysisId}/export?format=${format}`),
}

export default api

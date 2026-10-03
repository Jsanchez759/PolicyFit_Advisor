import axios from 'axios'

// Vercel does not read the developer's ignored .env file. Keep production
// usable when VITE_API_URL has not been configured in the Vercel project.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://policyfit-advisor.onrender.com/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  // Render's free instance may take 50+ seconds to wake after inactivity.
  timeout: 90000,
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
  list: () => api.get('/policies'),
  getPolicy: (policyId) => api.get(`/policies/${policyId}`),
  deletePolicy: (policyId) => api.delete(`/policies/${policyId}`),
}

// Business endpoints
export const businessService = {
  create: (businessData) => api.post('/business', businessData),
  list: () => api.get('/business'),
  get: (businessId) => api.get(`/business/${businessId}`),
  update: (businessId, businessData) => api.put(`/business/${businessId}`, businessData),
  delete: (businessId) => api.delete(`/business/${businessId}`),
}

// Recommendation endpoints
export const recommendationService = {
  analyze: (analysisRequest) => api.post('/recommendations/analyze', analysisRequest),
  list: () => api.get('/recommendations'),
  getAnalysis: (analysisId) => api.get(`/recommendations/${analysisId}`),
  delete: (analysisId) => api.delete(`/recommendations/${analysisId}`),
  getChat: (analysisId) => api.get(`/recommendations/${analysisId}/chat`),
  sendChat: (analysisId, message) =>
    api.post(`/recommendations/${analysisId}/chat`, { message }),
}

// Report endpoints
export const reportService = {
  getPdfReport: (analysisId) => api.get(`/reports/${analysisId}/pdf`, { responseType: 'blob' }),
  getHtmlReport: (analysisId) => api.get(`/reports/${analysisId}/html`),
  getJsonReport: (analysisId) => api.get(`/reports/${analysisId}/json`),
  exportReport: (analysisId, format) => api.post(`/reports/${analysisId}/export?format=${format}`),
}

export default api

import { create } from 'zustand'

export const useStore = create((set) => ({
  // Business Data
  businessData: null,
  businessId: null,
  setBusinessData: (data) => set({ businessData: data }),
  setBusinessId: (id) => set({ businessId: id }),

  // Policy Data
  policyId: null,
  policyData: null,
  setPolicyId: (id) => set({ policyId: id }),
  setPolicyData: (data) => set({ policyData: data }),

  // Analysis Results
  analysisId: null,
  analysisResults: null,
  setAnalysisId: (id) => set({ analysisId: id }),
  setAnalysisResults: (results) => set({ analysisResults: results }),

  // UI State
  isLoading: false,
  error: null,
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Step tracking
  currentStep: 'landing',
  setCurrentStep: (step) => set({ currentStep: step }),

  // Reset
  reset: () => set({
    businessData: null,
    businessId: null,
    policyId: null,
    policyData: null,
    analysisId: null,
    analysisResults: null,
    isLoading: false,
    error: null,
    currentStep: 'landing',
  }),
}))

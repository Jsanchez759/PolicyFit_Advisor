export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/
  return phone.length >= 10 && re.test(phone)
}

export const validateZipCode = (zip) => {
  const re = /^\d{5}(-\d{4})?$/
  return re.test(zip)
}

export const validateNAICS = (code) => {
  return /^\d{6}$/.test(code)
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export const formatPercent = (value) => {
  return `${(value * 100).toFixed(2)}%`
}

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

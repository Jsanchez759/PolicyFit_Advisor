import { useState, useEffect } from 'react'

export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetchFunction()
        if (!result) {
          setData(null)
        } else if (Object.prototype.hasOwnProperty.call(result, 'data')) {
          setData(result.data)
        } else {
          setData(result)
        }
        setError(null)
      } catch (err) {
        setError(err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error }
}

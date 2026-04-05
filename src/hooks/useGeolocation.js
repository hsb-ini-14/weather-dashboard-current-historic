import { useState, useEffect } from 'react'

export function useGeolocation(onSuccess) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSuccess({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: 'Your Location'
        })
        setLoading(false)
      },
      (err) => {
        setError('Unable to retrieve your location. Showing default location (London).')
        // Default to London if permission denied or error
        onSuccess({
          lat: 51.5074,
          lon: -0.1278,
          name: 'London, UK (Default)'
        })
        setLoading(false)
      }
    )
  }, []) // Empty dependency array means this runs once on mount

  return { loading, error }
}

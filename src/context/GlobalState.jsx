import { createContext, useContext, useState } from 'react'

const GlobalStateContext = createContext()

export function GlobalStateProvider({ children }) {
  const [temperatureUnit, setTemperatureUnit] = useState('celsius')
  const [location, setLocation] = useState({ lat: null, lon: null, name: 'Detecting Location...' })

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius')
  }

  return (
    <GlobalStateContext.Provider value={{
      temperatureUnit,
      toggleTemperatureUnit,
      location,
      setLocation
    }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)

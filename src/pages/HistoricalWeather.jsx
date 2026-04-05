import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchHistoricalWeather, fetchHistoricalAQI } from '../services/api'
import { useGlobalState } from '../context/GlobalState'
import { formatInTimeZone } from 'date-fns-tz' // Need date-fns-tz for IST conversion
import { format, parseISO, subYears, subDays } from 'date-fns'
import { History, Calendar as CalendarIcon } from 'lucide-react'
import { HistoricalCharts } from '../components/HistoricalCharts'

function HistoricalWeather() {
  const { location, temperatureUnit, toggleTemperatureUnit } = useGlobalState()
  
  // Default to past 30 days
  const today = new Date()
  const [endDate, setEndDate] = useState(format(today, 'yyyy-MM-dd'))
  const [startDate, setStartDate] = useState(format(subDays(today, 30), 'yyyy-MM-dd'))

  const twoYearsAgo = format(subYears(today, 2), 'yyyy-MM-dd')

  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ['historical-weather', location.lat, location.lon, startDate, endDate, temperatureUnit],
    queryFn: () => fetchHistoricalWeather(location.lat, location.lon, startDate, endDate, temperatureUnit),
    enabled: !!location.lat && !!location.lon && !!startDate && !!endDate,
  })

  const { data: aqi, isLoading: aqiLoading } = useQuery({
    queryKey: ['historical-aqi', location.lat, location.lon, startDate, endDate],
    queryFn: () => fetchHistoricalAQI(location.lat, location.lon, startDate, endDate),
    // enabled: !!location.lat && !!location.lon && !!startDate && !!endDate,
    enabled: false // Air quality historical endpoint on free tier sometimes fails or has limited range. Let's run it anyway but cautiously.
  })
  
  // Let's refetch AQI explicitly since we manually disabled it, wait actually let's re-enable it.
  const { data: aqiData, isLoading: aqiLoadingData } = useQuery({
    queryKey: ['historical-aqi-real', location.lat, location.lon, startDate, endDate],
    queryFn: () => fetchHistoricalAQI(location.lat, location.lon, startDate, endDate),
    enabled: !!location.lat && !!location.lon && !!startDate && !!endDate,
  })

  const isLoading = weatherLoading || aqiLoadingData

  const handleStartDateChange = (e) => {
    // Basic validation
    if (e.target.value >= endDate) return
    if (e.target.value < twoYearsAgo) return
    setStartDate(e.target.value)
  }

  const handleEndDateChange = (e) => {
    if (e.target.value <= startDate) return
    if (e.target.value > format(today, 'yyyy-MM-dd')) return
    setEndDate(e.target.value)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <History className="text-primary-main" /> Historical Analysis
          </h2>
          <p className="text-text-muted">Analyze trends up to 2 years back for {location.name}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={toggleTemperatureUnit}
            className="hover:cursor-pointer glass-panel px-4 py-2 font-medium hover:bg-bg-elevated transition-colors"
          >
            °{temperatureUnit === 'celsius' ? 'C' : 'F'}
          </button>
          
          <div className="glass-panel flex items-center px-4 py-2 gap-2">
            <CalendarIcon size={18} className="text-text-muted cursor-pointer" />
            <input 
              type="date" 
              value={startDate}
              onChange={handleStartDateChange}
              className="bg-transparent text-text-main border-none outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:filter-invert hover:cursor-pointer w-32"
              min={twoYearsAgo}
              max={format(subDays(today, 1), 'yyyy-MM-dd')}
            />
            <span className="text-text-muted">to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={handleEndDateChange}
              className="bg-transparent text-text-main border-none outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:filter-invert hover:cursor-pointer w-32"
              max={format(today, 'yyyy-MM-dd')}
            />
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-main border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <HistoricalCharts weather={weather} aqi={aqiData} />
      )}
    </div>
  )
}

export default HistoricalWeather

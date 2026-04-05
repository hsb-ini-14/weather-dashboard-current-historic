import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  fetchWeather, 
  fetchAirQuality 
} from '../services/api'
import { useGlobalState } from '../context/GlobalState'
import { useGeolocation } from '../hooks/useGeolocation'
import { MetricCard } from '../components/MetricCard'
import { HourlyCharts } from '../components/HourlyCharts'
import { AQISection } from '../components/AQISection'
import { format, parseISO } from 'date-fns'
import { 
  Thermometer, Droplets, Sun, Wind, Calendar as CalendarIcon, MapPin 
} from 'lucide-react'

function CurrentWeather() {
  const { location, setLocation, temperatureUnit, toggleTemperatureUnit } = useGlobalState()
  const { loading: geoLoading } = useGeolocation((pos) => setLocation(pos))
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ['weather', location.lat, location.lon, selectedDate, temperatureUnit],
    queryFn: () => fetchWeather(location.lat, location.lon, selectedDate, temperatureUnit),
    enabled: !!location.lat && !!location.lon,
  })

  const { data: aqi, isLoading: aqiLoading } = useQuery({
    queryKey: ['aqi', location.lat, location.lon, selectedDate],
    queryFn: () => fetchAirQuality(location.lat, location.lon, selectedDate),
    enabled: !!location.lat && !!location.lon,
  })

  if (geoLoading) {
    return <div className="h-64 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary-main border-t-transparent rounded-full"></div>
    </div>
  }

  const isLoading = weatherLoading || aqiLoading

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="text-primary-main" /> {location.name}
          </h2>
          <p className="text-text-muted">Weather overview and forecasts</p>
        </div>
        
        <div className="flex gap-4">
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
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-text-main border-none outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:filter-invert hover:cursor-pointer"
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-main border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Temperature"
              value={`${weather?.current?.temperature_2m}°`}
              subtitle={`Min: ${weather?.daily?.temperature_2m_min[0]}° | Max: ${weather?.daily?.temperature_2m_max[0]}°`}
              icon={Thermometer}
            />
            <MetricCard 
              title="Atmospherics"
              value={`${weather?.current?.relative_humidity_2m}% Humidity`}
              subtitle={`UV Max: ${weather?.daily?.uv_index_max[0]} | Precip: ${weather?.current?.precipitation}mm`}
              icon={Droplets}
              colorClass="text-primary-light"
            />
            <MetricCard 
              title="Sun Cycle"
              value={format(parseISO(weather?.daily?.sunrise[0] || new Date().toISOString()), 'HH:mm')}
              subtitle={`Sunset: ${format(parseISO(weather?.daily?.sunset[0] || new Date().toISOString()), 'HH:mm')}`}
              icon={Sun}
              colorClass="text-warning"
            />
            <MetricCard 
              title="Wind & Rain"
              value={`${weather?.current?.wind_speed_10m} km/h`}
              subtitle={`Max: ${weather?.daily?.wind_speed_10m_max[0]} km/h | Rain Prob: ${weather?.daily?.precipitation_probability_max[0]}%`}
              icon={Wind}
              colorClass="text-accent"
            />
          </div>

          {/* AQI Section */}
          <AQISection aqi={aqi} />

          <HourlyCharts weather={weather} aqi={aqi} />
        </>
      )}
    </div>
  )
}

export default CurrentWeather

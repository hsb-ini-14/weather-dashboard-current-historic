const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const HISTORICAL_URL = 'https://archive-api.open-meteo.com/v1/archive'

// Current & Hourly Forecast
export const fetchWeather = async (lat, lon, dateObj, unit) => {
  const isFahrenheit = unit === 'fahrenheit'
  const tempUnit = isFahrenheit ? '&temperature_unit=fahrenheit' : ''
  
  // Format date if provided, otherwise it's just today's forecast
  const dateStr = dateObj ? `&start_date=${dateObj}&end_date=${dateObj}` : ''

  const res = await fetch(
    `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto${tempUnit}${dateStr}`
  )
  if (!res.ok) throw new Error('Failed to fetch weather data')
  return res.json()
}

export const fetchAirQuality = async (lat, lon, dateObj) => {
  const dateStr = dateObj ? `&start_date=${dateObj}&end_date=${dateObj}` : ''
  const res = await fetch(
    `${AQI_URL}?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm10,pm2_5&timezone=auto${dateStr}`
  )
  if (!res.ok) throw new Error('Failed to fetch air quality data')
  return res.json()
}

// Historical Data Archive
export const fetchHistoricalWeather = async (lat, lon, startDate, endDate, unit) => {
  const isFahrenheit = unit === 'fahrenheit'
  const tempUnit = isFahrenheit ? '&temperature_unit=fahrenheit' : ''
  
  const res = await fetch(
    `${HISTORICAL_URL}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto${tempUnit}`
  )
  if (!res.ok) throw new Error('Failed to fetch historical weather')
  return res.json()
}

export const fetchHistoricalAQI = async (lat, lon, startDate, endDate) => {
  // Not all historical AQI is in the same API, but Open-Meteo provides it in air-quality history occasionally or we can use forecast endpoint with past dates.
  // Actually, air-quality API supports past days up to a certain point.
  // Let's use the air quality API directly with start/end date.
  const res = await fetch(
    `${AQI_URL}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=pm10,pm2_5&timezone=auto`
  )
  if (!res.ok) throw new Error('Failed to fetch historical AQI')
  return res.json()
}

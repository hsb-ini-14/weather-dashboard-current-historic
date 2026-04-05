import React from 'react'
import { Timer } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Bar
} from 'recharts'

export function HourlyCharts({ weather, aqi }) {
  if (!weather?.hourly) return null;

  const data = weather.hourly.time.map((time, index) => {
    return {
      time: format(parseISO(time), 'HH:mm'),
      temperature: weather.hourly.temperature_2m[index],
      humidity: weather.hourly.relative_humidity_2m[index],
      precipitation: weather.hourly.precipitation[index],
      visibility: weather.hourly.visibility[index] / 1000, // km
      wind: weather.hourly.wind_speed_10m[index],
      pm10: aqi?.hourly?.pm10?.[index] || 0,
      pm25: aqi?.hourly?.pm2_5?.[index] || 0,
    }
  })

  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  }

  const tooltipStyle = {
    backgroundColor: '#1e293b',
    border: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: '#f8fafc',
    borderRadius: '0.5rem'
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2 mt-8">
        <Timer className="text-primary-main" /> Hourly Forecasts
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature */}
        <div className="glass-panel p-4 h-72">
          <h4 className="text-sm text-text-muted mb-4">Temperature</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="temperature" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity */}
        <div className="glass-panel p-4 h-72">
          <h4 className="text-sm text-text-muted mb-4">Relative Humidity (%)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Precipitation */}
        <div className="glass-panel p-4 h-72">
          <h4 className="text-sm text-text-muted mb-4">Precipitation (mm)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="step" dataKey="precipitation" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPrecip)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Wind Speed */}
        <div className="glass-panel p-4 h-72">
          <h4 className="text-sm text-text-muted mb-4">Wind Speed (km/h)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="wind" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Visibility */}
        <div className="glass-panel p-4 h-72">
          <h4 className="text-sm text-text-muted mb-4">Visibility (km)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="visibility" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AQI Combined */}
        <div className="glass-panel p-4 h-72">
          <h4 className="text-sm text-text-muted mb-4">Air Quality (PM10 & PM2.5)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="pm10" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="pm25" stroke="#f8fafc" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

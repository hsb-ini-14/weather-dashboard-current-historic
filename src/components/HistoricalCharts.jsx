import React from 'react'
import { parseISO } from 'date-fns'
import { format } from 'date-fns-tz'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts'

export function HistoricalCharts({ weather, aqi }) {
  if (!weather?.daily) return <div className="text-center p-8 text-text-muted">No historical data available for this range.</div>;

  // Prepare data
  const data = weather.daily.time.map((date, index) => {
    // Sun cycle in IST
    const sunriseP = parseISO(weather.daily.sunrise[index] || date)
    const sunsetP = parseISO(weather.daily.sunset[index] || date)
    
    // We can use a lightweight approach to just show HH:mm in IST, but date-fns-tz will be robust.
    // For now we'll format as string.

    return {
      date,
      tempMax: weather.daily.temperature_2m_max[index],
      tempMin: weather.daily.temperature_2m_min[index],
      tempMean: weather.daily.temperature_2m_mean[index],
      precip: weather.daily.precipitation_sum[index],
      windMax: weather.daily.wind_speed_10m_max[index],
      windDir: weather.daily.wind_direction_10m_dominant[index],
      sunriseTime: format(sunriseP, 'HH:mm'), // Should be IST if required
      sunsetTime: format(sunsetP, 'HH:mm')
    }
  })

  // Hourly AQI needs to be daily averaged for chart or similar.
  // Since AQI API is hourly, we just sample it or aggregate it per day.
  const aqiData = []
  if (aqi?.hourly) {
    let currentDay = ''
    let dailyAqi = { pm10Sum: 0, pm25Sum: 0, count: 0 }
    
    aqi.hourly.time.forEach((timeStr, index) => {
      const day = timeStr.split('T')[0]
      if (currentDay !== day) {
        if (currentDay && dailyAqi.count > 0) {
          aqiData.push({
            date: currentDay,
            pm10: Math.round(dailyAqi.pm10Sum / dailyAqi.count),
            pm25: Math.round(dailyAqi.pm25Sum / dailyAqi.count),
          })
        }
        currentDay = day
        dailyAqi = { pm10Sum: 0, pm25Sum: 0, count: 0 }
      }
      
      const pm10 = aqi.hourly.pm10[index]
      const pm25 = aqi.hourly.pm2_5[index]
      if (pm10 !== null) { dailyAqi.pm10Sum += pm10; dailyAqi.count++ }
      if (pm25 !== null) { dailyAqi.pm25Sum += pm25 }
    })
    
    if (dailyAqi.count > 0) {
      aqiData.push({
        date: currentDay,
        pm10: Math.round(dailyAqi.pm10Sum / dailyAqi.count),
        pm25: Math.round(dailyAqi.pm25Sum / dailyAqi.count),
      })
    }
  }

  const commonProps = {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Temperature Trends */}
        <div className="glass-panel p-4 h-80">
          <h4 className="text-sm text-text-muted mb-4">Temperature Trends (Mean, Min, Max)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} minTickGap={30} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="tempMax" stroke="#ef4444" dot={false} strokeWidth={2} name="Max Temp" />
              <Line type="monotone" dataKey="tempMean" stroke="#0ea5e9" dot={false} strokeWidth={2} name="Mean Temp" />
              <Line type="monotone" dataKey="tempMin" stroke="#38bdf8" dot={false} strokeWidth={2} name="Min Temp" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Precipitation */}
        <div className="glass-panel p-4 h-80">
          <h4 className="text-sm text-text-muted mb-4">Daily Precipitation Sum (mm)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} minTickGap={30} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="precip" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Precipitation" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wind Max & Dominant Direction */}
        <div className="glass-panel p-4 h-80">
          <h4 className="text-sm text-text-muted mb-4">Max Wind Speed (km/h)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} {...commonProps}>
               <defs>
                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} minTickGap={30} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="windMax" stroke="#10b981" fill="url(#colorWind)" name="Wind Speed Max" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AQI Trends */}
        {aqiData.length > 0 && (
          <div className="glass-panel p-4 h-80">
            <h4 className="text-sm text-text-muted mb-4">Avg Daily PM10 & PM2.5 Trends</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aqiData} {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} minTickGap={30} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="pm10" stroke="#f59e0b" dot={false} strokeWidth={2} name="PM 10" />
                <Line type="monotone" dataKey="pm25" stroke="#f8fafc" dot={false} strokeWidth={2} name="PM 2.5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

       {/* Sun Cycle Details Data Grid (instead of chart because timestamp plotting varies greatly) */}
       <div className="glass-panel p-6 overflow-x-auto">
          <h4 className="text-sm text-text-muted mb-4">Sun Cycle Data Log (IST approximate mapping)</h4>
          <div className="min-w-full inline-block align-middle">
            <div className="border border-glass-border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-glass-border">
                <thead className="bg-bg-elevated">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Sunrise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Sunset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Dominant Wind Dir (°)</th>
                  </tr>
                </thead>
                <tbody className="bg-bg-base/30 divide-y divide-glass-border">
                  {data.slice(-10).map((row, i) => (
                    <tr key={i} className="hover:bg-bg-elevated/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">{row.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-warning">{row.sunriseTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-warning">{row.sunsetTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">{row.windDir}°</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted mt-2">(Showing last 10 days of active selection)</p>
          </div>
       </div>

    </div>
  )
}

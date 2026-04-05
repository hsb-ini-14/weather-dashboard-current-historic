import React from 'react'
import { Activity } from 'lucide-react'

export function AQISection({ aqi }) {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-main">
        <Activity className="text-success" /> Air Quality Metrics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="text-center p-3 bg-bg-base/40 rounded-lg">
          <div className="text-text-muted text-xs mb-1">Status</div>
          <div className="font-bold text-xl">{aqi?.current?.european_aqi ?? '-'}</div>
        </div>
        <div className="text-center p-3 bg-bg-base/40 rounded-lg">
          <div className="text-text-muted text-xs mb-1">PM10</div>
          <div className="font-bold text-xl">{aqi?.current?.pm10 ?? '-'}</div>
        </div>
        <div className="text-center p-3 bg-bg-base/40 rounded-lg">
          <div className="text-text-muted text-xs mb-1">PM2.5</div>
          <div className="font-bold text-xl">{aqi?.current?.pm2_5 ?? '-'}</div>
        </div>
        <div className="text-center p-3 bg-bg-base/40 rounded-lg">
          <div className="text-text-muted text-xs mb-1">CO</div>
          <div className="font-bold text-xl">{aqi?.current?.carbon_monoxide ?? '-'}</div>
        </div>
        <div className="text-center p-3 bg-bg-base/40 rounded-lg">
          <div className="text-text-muted text-xs mb-1">O3</div>
          <div className="font-bold text-xl">{aqi?.current?.ozone ?? '-'}</div>
        </div>
        <div className="text-center p-3 bg-bg-base/40 rounded-lg">
          <div className="text-text-muted text-xs mb-1">NO2</div>
          <div className="font-bold text-xl">{aqi?.current?.nitrogen_dioxide ?? '-'}</div>
        </div>
        <div className="text-center p-3 bg-bg-base/40 rounded-lg">
          <div className="text-text-muted text-xs mb-1">SO2</div>
          <div className="font-bold text-xl">{aqi?.current?.sulphur_dioxide ?? '-'}</div>
        </div>
      </div>
    </div>
  )
}

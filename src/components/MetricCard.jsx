import React from 'react'

export function MetricCard({ title, value, subtitle, icon: Icon, colorClass = "text-primary-main" }) {
  return (
    <div className="glass-panel p-5 flex flex-col gap-3 hover:transform hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={20} className={colorClass} />}
        <h3 className="text-text-muted font-medium text-sm flex-1">{title}</h3>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {subtitle && <span className="text-xs text-text-muted mt-1">{subtitle}</span>}
      </div>
    </div>
  )
}

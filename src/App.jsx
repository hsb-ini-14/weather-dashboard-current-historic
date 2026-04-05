import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { CloudRain, History, MapPin } from 'lucide-react'
import CurrentWeather from './pages/CurrentWeather'
import HistoricalWeather from './pages/HistoricalWeather'
import { GlobalStateProvider } from './context/GlobalState'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="glass-panel sticky top-4 z-50 mx-4 mt-4 mb-8 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-main/20 flex items-center justify-center text-primary-main">
          <CloudRain size={24} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-light to-primary-main bg-clip-text text-transparent">
          MeteoInsights
        </h1>
      </div>
      <div className="flex bg-bg-base/50 p-1 rounded-lg">
        <Link 
          to="/" 
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'bg-primary-main text-white' : 'hover:bg-bg-elevated text-text-muted hover:text-white'}`}
        >
          <MapPin size={18} />
          <span className="hidden sm:inline">Current</span>
        </Link>
        <Link 
          to="/historical" 
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${location.pathname === '/historical' ? 'bg-primary-main text-white' : 'hover:bg-bg-elevated text-text-muted hover:text-white'}`}
        >
          <History size={18} />
          <span className="hidden sm:inline">Historical</span>
        </Link>
      </div>
    </nav>
  )
}

function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <div className="max-w-6xl mx-auto pb-12">
          <Navigation />
          <main className="px-4 animate-fade-in">
            <Routes>
              <Route path="/" element={<CurrentWeather />} />
              <Route path="/historical" element={<HistoricalWeather />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GlobalStateProvider>
  )
}

export default App

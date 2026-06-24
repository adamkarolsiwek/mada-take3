import { useState } from 'react'
import D20 from './components/D20'
import WeatherMap from './components/WeatherMap'
import './App.css'

export default function App() {
  const [diceValue, setDiceValue] = useState(1)
  const [rolling, setRolling] = useState(false)
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const rollDice = () => {
    if (rolling) return
    setRolling(true)
    setTimeout(() => {
      setDiceValue(Math.floor(Math.random() * 20) + 1)
      setRolling(false)
    }, 820)
  }

  const getTemperature = async () => {
    if (!query.trim() || loading) return
    setLoading(true)
    setError('')
    setWeather(null)
    try {
      const url = new URL('/api/weather', window.location.origin)
      url.searchParams.set('q', query.trim())
      const res = await fetch(url)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setWeather(data)
      }
    } catch {
      setError('Failed to reach the weather service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Demo App</h1>

      {/* ── Dice ── */}
      <section className="card">
        <h2>Roll the Dice</h2>
        <D20 value={diceValue} rolling={rolling} />
        <p className="dice-result">{diceValue} / 20</p>
        <button onClick={rollDice} disabled={rolling}>
          {rolling ? 'Rolling…' : 'Roll Again'}
        </button>
      </section>

      {/* ── Weather ── */}
      <section className="card">
        <h2>Current Weather</h2>
        <input
          type="text"
          placeholder="City or place  (e.g. Tokyo, Eiffel Tower)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && getTemperature()}
        />
        <button onClick={getTemperature} disabled={loading || !query.trim()}>
          {loading ? 'Fetching…' : 'Get Temperature'}
        </button>

        {weather && (
          <>
            <div className="weather-result">
              {weather.place && (
                <span className="place-name">{weather.place}</span>
              )}
              <span className="temp">{weather.temperature}°C</span>
              <span className="city-label">{weather.city}</span>
            </div>

            <WeatherMap
              main={{
                name: weather.place || weather.city,
                lat: weather.lat,
                lon: weather.lon,
                temperature: weather.temperature,
              }}
              cities={weather.map_cities || []}
            />
          </>
        )}

        {error && <p className="error">{error}</p>}
      </section>
    </div>
  )
}

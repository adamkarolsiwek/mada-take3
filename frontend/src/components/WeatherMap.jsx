import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'

function tempColor(t) {
  if (t < -10) return '#1e3a8a'
  if (t <   0) return '#3b82f6'
  if (t <   8) return '#06b6d4'
  if (t <  15) return '#22c55e'
  if (t <  20) return '#a3e635'
  if (t <  26) return '#facc15'
  if (t <  32) return '#f97316'
  return '#ef4444'
}

function AutoBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    const lls = points.map(p => [p.lat, p.lon])
    if (lls.length === 1) {
      map.setView(lls[0], 9)
    } else {
      try { map.fitBounds(lls, { padding: [36, 36], maxZoom: 8 }) }
      catch { map.setView(lls[0], 6) }
    }
  }, [points.map(p => `${p.lat},${p.lon}`).join('|')])
  return null
}

export default function WeatherMap({ main, cities }) {
  const all = [{ ...main, isMain: true }, ...cities]

  return (
    <div style={{
      height: 280, marginTop: 20, borderRadius: 14,
      overflow: 'hidden', border: '1px solid #2e3350',
    }}>
      <MapContainer
        center={[main.lat, main.lon]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        <AutoBounds points={all} />
        {all.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lon]}
            radius={p.isMain ? 15 : 10}
            fillColor={tempColor(p.temperature)}
            fillOpacity={0.88}
            color={p.isMain ? '#ffffff' : 'rgba(255,255,255,0.35)'}
            weight={p.isMain ? 2.5 : 1.5}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
              <span style={{ fontWeight: p.isMain ? 700 : 400 }}>{p.name}</span>
              <br />
              <span style={{ color: tempColor(p.temperature), fontWeight: 700 }}>
                {p.temperature}°C
              </span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

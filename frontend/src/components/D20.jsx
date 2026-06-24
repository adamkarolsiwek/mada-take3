import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import '../D20.css'

const WEATHER = {
  1:'storm', 2:'storm', 3:'storm',
  4:'rain',  5:'rain',  6:'rain',
  7:'snow',  8:'snow',  9:'snow',
  10:'wind', 11:'wind', 12:'wind',
  13:'cloudy',14:'cloudy',15:'cloudy',
  16:'partly',17:'partly',18:'partly',
  19:'sun',  20:'sun',
}

const ACCENT = {
  storm:'#818cf8', rain:'#60a5fa', snow:'#bfdbfe',
  wind:'#34d399',  cloudy:'#94a3b8', partly:'#fcd34d', sun:'#f59e0b',
}

// ── Particle overlays (unchanged) ────────────────────────────────────────────

function Rain({ n = 18 }) {
  return (
    <div className="wx-layer">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="wx-drop" style={{
          left: `${(i * 13 + 3) % 97}%`,
          animationDelay: `${((i * 0.17) % 1.1).toFixed(2)}s`,
          animationDuration: `${(0.45 + (i * 0.09) % 0.35).toFixed(2)}s`,
          height: `${9 + (i % 4) * 3}px`,
          opacity: 0.55 + (i % 3) * 0.15,
        }} />
      ))}
    </div>
  )
}

function Snow({ n = 14 }) {
  return (
    <div className="wx-layer">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="wx-snow" style={{
          left: `${(i * 7 + 5) % 92}%`,
          animationDelay: `${((i * 0.27) % 2.5).toFixed(2)}s`,
          animationDuration: `${(2.2 + (i * 0.28) % 1.3).toFixed(2)}s`,
          fontSize: `${8 + (i % 4) * 4}px`,
        }}>❄</span>
      ))}
    </div>
  )
}

function Lightning() {
  return (
    <div className="wx-layer">
      <div className="wx-flash" />
      <svg className="wx-bolt" viewBox="0 0 28 68" fill="none">
        <polyline points="20,2 7,36 15,36 3,66"
          stroke="#fbbf24" strokeWidth="3.5"
          strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Wind({ n = 5 }) {
  return (
    <div className="wx-layer">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="wx-wind" style={{
          top: `${18 + i * 14}%`,
          width: `${45 + (i % 3) * 18}%`,
          animationDelay: `${(i * 0.35).toFixed(2)}s`,
          animationDuration: `${(1.1 + (i * 0.2) % 0.6).toFixed(2)}s`,
          opacity: 0.35 + (i % 2) * 0.2,
        }} />
      ))}
    </div>
  )
}

function Clouds({ n = 3 }) {
  return (
    <div className="wx-layer">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="wx-cloud" style={{
          top: `${12 + i * 22}%`,
          animationDelay: `${(i * 1.8).toFixed(1)}s`,
          animationDuration: `${(6 + i * 1.5).toFixed(1)}s`,
          opacity: 0.28 + i * 0.08,
          width: `${65 + (i % 2) * 20}px`,
        }} />
      ))}
    </div>
  )
}

function SunRays() {
  return (
    <div className="wx-layer wx-sun-layer">
      <div className="wx-sun-glow" />
      <div className="wx-sun-ring">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="wx-ray" style={{ transform: `rotate(${i * 45}deg)` }} />
        ))}
      </div>
    </div>
  )
}

function WeatherOverlay({ type }) {
  switch (type) {
    case 'storm':  return <><Rain n={22} /><Lightning /></>
    case 'rain':   return <Rain />
    case 'snow':   return <Snow />
    case 'wind':   return <Wind />
    case 'cloudy': return <Clouds />
    case 'partly': return <><Clouds n={2} /><SunRays /></>
    case 'sun':    return <SunRays />
    default:       return null
  }
}

// ── 3-D icosahedron ──────────────────────────────────────────────────────────

function IcoMesh({ rolling, color }) {
  const grp = useRef()
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.42, 0), [])
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo])

  useFrame(({ clock }, delta) => {
    if (!grp.current) return
    const t = clock.elapsedTime
    if (rolling) {
      grp.current.rotation.x += delta * 9
      grp.current.rotation.y += delta * 14
      grp.current.rotation.z += delta * 4
    } else {
      grp.current.rotation.y += delta * 0.45
      grp.current.rotation.x = Math.sin(t * 0.38) * 0.22
    }
  })

  return (
    <group ref={grp}>
      {/* Solid dark face */}
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#0c0f1a"
          roughness={0.1}
          metalness={0.85}
          emissive={color}
          emissiveIntensity={0.07}
        />
      </mesh>
      {/* Glowing edges */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.9} />
      </lineSegments>
    </group>
  )
}

// ── Public component ─────────────────────────────────────────────────────────

export default function D20({ value, rolling }) {
  const wx    = WEATHER[value] || 'cloudy'
  const color = ACCENT[wx]

  return (
    <div className={`d20-wrap wx-${wx}`}>
      <WeatherOverlay type={wx} />

      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: 200, height: 200, display: 'block' }}
      >
        <ambientLight intensity={0.18} />
        {/* Main accent-coloured light from front-top */}
        <pointLight position={[2.5, 3, 4]} intensity={2.5} color={color} />
        {/* Cool fill from below-back */}
        <pointLight position={[-2, -2, -2]} intensity={0.3} color="#7080b0" />
      <IcoMesh rolling={rolling} color={color} />
      </Canvas>

      {/* Number always visible, coloured by weather accent */}
      <div className="d20-number" style={{ color, textShadow: `0 0 18px ${color}` }}>
        {value}
      </div>
    </div>
  )
}

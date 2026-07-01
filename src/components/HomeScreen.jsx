import { useEffect, useRef } from 'react'

const titleBase = {
  fontFamily: "'BBTorsosPro', sans-serif",
  fontSize: 'clamp(3rem, 9.5vw, 11rem)',
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  textAlign: 'center',
  lineHeight: 0.92,
  userSelect: 'none',
  margin: 0,
}

const names = ['Zhasmin Roumieh', 'Mareike Sophie Steffen', 'Dikshya Pokharel']

export default function HomeScreen({ active, onEnter }) {
  const containerRef = useRef(null)

  // Auto-focus so keyboard events are captured reliably
  useEffect(() => {
    if (active && containerRef.current) containerRef.current.focus()
  }, [active])

  // Global keyboard fallback
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key === 'Backspace') { e.preventDefault(); onEnter() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, onEnter])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Backspace') { e.preventDefault(); onEnter() } }}
      style={{
        position: 'absolute', inset: 0,
        background: '#FFFFFF',
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'all' : 'none',
        transition: 'opacity 0.8s ease',
        overflow: 'hidden',
        outline: 'none',
      }}
    >
      {/* Scrolling pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${import.meta.env.BASE_URL}images/PATTERN3.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: '20vw auto',
        backgroundPosition: '0 0',
        opacity: 0.65,
        animation: 'scrollRight 7s linear infinite',
      }} />

      {/* Background glitch flash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#a82b39',
        opacity: 0,
        animation: 'screenFlash 5s infinite',
        zIndex: 6,
        pointerEvents: 'none',
      }} />

      {/* Background scan line */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: '23%',
        height: '3px',
        background: '#5B9EA0',
        opacity: 0,
        animation: 'glitchLine 6s infinite',
        zIndex: 7,
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <h1 style={{ ...titleBase, color: '#a82b39' }}>
          AGENTIC<br />SQUARE
        </h1>
      </div>

      {/* Author names — bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '3.5rem', left: '3rem',
        display: 'flex', flexDirection: 'column', gap: '0.3rem',
        zIndex: 10, pointerEvents: 'none',
      }}>
        {names.map((name) => (
          <span key={name} style={{
            fontFamily: "'BBTorsosPro', sans-serif",
            fontSize: '0.6rem', fontWeight: 400,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#8A8A8A', userSelect: 'none',
          }}>
            {name}
          </span>
        ))}
      </div>

      {/* Click backspace — bottom centre, acts as button too */}
      <button
        onClick={onEnter}
        className="hint-pulse"
        style={{
          position: 'absolute',
          bottom: '3.5rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '0.55rem',
          color: '#8A8A8A',
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: '0.75rem', fontWeight: 400,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          zIndex: 10,
          background: 'none', border: 'none',
          cursor: 'pointer', padding: 0,
        }}
      >
        <span style={{ fontSize: '1rem' }}>←</span>
        <span>CLICK BACKSPACE</span>
      </button>
    </div>
  )
}

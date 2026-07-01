import { useState, useEffect, useRef } from 'react'

const TOGGLES = [
  { label: 'Interactive Chat and AR Visualization', bg: '#5B9EA0', text: '#fff'    },
  { label: '3D View',                              bg: '#D4901A', text: '#fff'    },
  { label: 'Building Storyboard',                  bg: '#C41E3A', text: '#fff'    },
  { label: 'Scenarios',                            bg: '#ECC8BC', text: '#1a1a1a' },
  { label: 'Brochures',                            bg: '#3D7A76', text: '#fff'    },
]

const GIF_WAIT = 2500 // ms before toggles appear

export default function NextScreen({ active, onSelect }) {
  const [showToggles, setShowToggles] = useState(false)
  const gifRef = useRef(null)

  useEffect(() => {
    if (!active) { setShowToggles(false); return }

    // Restart GIF from first frame each time screen activates
    if (gifRef.current) {
      const src = gifRef.current.src
      gifRef.current.src = ''
      gifRef.current.src = src
    }

    const t = setTimeout(() => setShowToggles(true), GIF_WAIT)
    return () => clearTimeout(t)
  }, [active])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#fff',
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 0.7s ease',
      overflow: 'hidden',
    }}>
      {/* GIF — full screen, shifted down slightly */}
      <img
        ref={gifRef}
        src={`${import.meta.env.BASE_URL}images/spread.gif`}
        alt="Spread"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />

      {/* White gradient at bottom so toggles are readable */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '200px',
        background: 'linear-gradient(to top, rgba(255,255,255,0.96) 0%, transparent 100%)',
        opacity: showToggles ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
        zIndex: 9,
      }} />

      {/* Toggle buttons */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: 0, right: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.8rem',
        justifyContent: 'center',
        padding: '0 3rem',
        zIndex: 10,
        opacity: showToggles ? 1 : 0,
        transform: showToggles ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        pointerEvents: showToggles ? 'all' : 'none',
      }}>
        {TOGGLES.map((t) => (
          <button
            key={t.label}
            onClick={() => onSelect(t.label)}
            style={{
              fontFamily: "'BBTorsosPro', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              background: t.bg,
              color: t.text,
              border: 'none',
              padding: '0.8rem 1.6rem',
              borderRadius: '100px',
              cursor: 'pointer',
              transition: 'filter 0.15s ease, transform 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.88)'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)';    e.currentTarget.style.transform = 'scale(1)'    }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

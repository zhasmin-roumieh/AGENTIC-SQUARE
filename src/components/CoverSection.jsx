import { useEffect, useRef } from 'react'
import useInView from '../hooks/useInView'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

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

// Direct jumps to sections a visitor might want without scrolling through
// everything — indices must match the section order set up in App.jsx.
const quickLinks = [
  { label: 'Site Analysis', index: 6 },
  { label: 'Interactive Chat', index: 8 },
  { label: 'Explore 3D', index: 9 },
  { label: 'Storyboard', index: 10 },
  { label: 'Scenarios', index: 11 },
  { label: 'Brochures', index: 13 },
]

export default function CoverSection({ innerRef, onNext, onJump, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  // Bonus desktop shortcut — the tap prompt below is the primary control.
  useEffect(() => {
    const onKey = e => { if (e.key === 'Backspace') { e.preventDefault(); onNext() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onNext])

  return (
    <section ref={attachRef} className="snap-section" style={{ background: '#FFFFFF' }}>
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

      {onJump && (
        <div style={{
          position: 'absolute', top: '2rem', right: '2.5rem', zIndex: 10,
          display: 'flex', justifyContent: 'flex-end', gap: '0.4rem',
        }}>
          {quickLinks.map(link => (
            <button
              key={link.index}
              onClick={() => onJump(link.index)}
              data-cursor-hover
              className="nav-pill"
              style={{
                background: 'none', border: '1px solid rgba(0,0,0,0.25)',
                borderRadius: '100px', padding: '0.35rem 0.8rem', cursor: 'pointer',
                fontFamily: "'BBTorsosPro', sans-serif",
                fontSize: '0.58rem', fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: '#1a1a1a', whiteSpace: 'nowrap',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {n && <SectionIndex n={n} />}
      <ScrollDownPrompt visible={inView} onClick={onNext} />
    </section>
  )
}

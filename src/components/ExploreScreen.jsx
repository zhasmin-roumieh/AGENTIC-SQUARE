import { useState, useEffect, useRef } from 'react'

const FULL_TEXT =
  'Design your square through help of AI in design, decision, building, maintenance, disassembly and paper work.'

export default function ExploreScreen({ active, onNext }) {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!active) { clearTimeout(timer.current); setText(''); setDone(false); return }
    let i = 0
    const type = () => {
      i++
      setText(FULL_TEXT.slice(0, i))
      if (i < FULL_TEXT.length) {
        timer.current = setTimeout(type, 28 + Math.random() * 45)
      } else {
        setDone(true)
      }
    }
    timer.current = setTimeout(type, 600)
    return () => clearTimeout(timer.current)
  }, [active])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#ECC8BC',
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 0.7s ease',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Same scrolling pattern as home */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${import.meta.env.BASE_URL}images/PATTERN3.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: '20vw auto',
        backgroundPosition: '0 0',
        opacity: 0.35,
        animation: 'scrollRight 7s linear infinite',
      }} />

      {/* Glitch flash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#a82b39',
        opacity: 0,
        animation: active ? 'screenFlash 5s infinite' : 'none',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Glitch scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '30%',
        height: '3px', background: '#5B9EA0',
        opacity: 0,
        animation: active ? 'glitchLine 6s infinite' : 'none',
        zIndex: 3, pointerEvents: 'none',
      }} />

      {/* Typewriter text */}
      <div style={{ position: 'relative', zIndex: 10, width: 'min(780px, 80vw)', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: 'clamp(1.4rem, 3.2vw, 3rem)',
          fontWeight: 400,
          color: '#1a1a1a',
          letterSpacing: '0.03em',
          lineHeight: 1.3,
          margin: 0,
        }}>
          {text}
          {!done && <span className="cursor" style={{ background: '#1a1a1a' }} />}
        </p>
      </div>

      {/* Next button */}
      <div style={{
        position: 'absolute', bottom: '4rem', right: '4rem',
        opacity: done ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: 10,
      }}>
        <button
          onClick={onNext}
          style={{
            fontFamily: "'BBTorsosPro', sans-serif",
            fontSize: '0.95rem', fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            background: '#1a1a1a', color: '#e0ad44',
            border: '2px solid #1a1a1a',
            padding: '1rem 3.5rem', borderRadius: '100px',
            cursor: 'pointer',
            transition: 'background 0.25s ease, color 0.25s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a1a1a' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#e0ad44' }}
        >
          NEXT →
        </button>
      </div>
    </div>
  )
}

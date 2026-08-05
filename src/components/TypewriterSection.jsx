import { useState, useEffect, useRef } from 'react'
import useInView from '../hooks/useInView'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

export default function TypewriterSection({ innerRef, text, mode = 'type', onNext, onBack, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  const [displayText, setDisplayText] = useState(mode === 'fade' ? text : '')
  const [visible, setVisible] = useState(mode !== 'fade')
  const [done, setDone] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!inView) return

    if (mode === 'fade') {
      const t = setTimeout(() => { setVisible(true); setDone(true) }, 300)
      return () => clearTimeout(t)
    }

    let i = 0
    const type = () => {
      i++
      setDisplayText(text.slice(0, i))
      if (i < text.length) {
        timer.current = setTimeout(type, 28 + Math.random() * 45)
      } else {
        setDone(true)
      }
    }
    timer.current = setTimeout(type, 600)
    return () => clearTimeout(timer.current)
  }, [inView, mode, text])

  return (
    <section ref={attachRef} className="snap-section" style={{
      background: '#ECC8BC',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Scrolling pattern, same as Cover */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${import.meta.env.BASE_URL}images/PATTERN3.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: '16rem auto',
        backgroundPosition: '0 0',
        opacity: 0.35,
        animation: 'scrollRight 7s linear infinite',
      }} />

      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        width: mode === 'fade' ? 'min(920px, 68rem)' : 'min(780px, 64rem)',
        maxHeight: '92vh', overflow: 'hidden',
        padding: '0 0.5rem',
      }}>
        <p style={{
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: mode === 'fade'
            ? 'clamp(0.95rem, 1.35rem, 1.55rem)'
            : 'clamp(1.25rem, 2.35rem, 2.7rem)',
          fontWeight: 400,
          color: '#1a1a1a',
          letterSpacing: '0.03em',
          lineHeight: 1.5,
          whiteSpace: 'pre-line',
          margin: 0,
          opacity: visible ? 1 : 0,
          transition: mode === 'fade' ? 'opacity 1.4s ease' : 'none',
        }}>
          {displayText}
          {mode === 'type' && !done && <span className="cursor" style={{ background: '#1a1a1a' }} />}
        </p>
      </div>

      {n && <SectionIndex n={n} />}
      {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
      <ScrollDownPrompt visible={done} onClick={onNext} />
    </section>
  )
}

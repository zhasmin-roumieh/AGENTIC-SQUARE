import { useState, useEffect, useRef } from 'react'
import useInView from '../hooks/useInView'
import useScrollProgress from '../hooks/useScrollProgress'
import { titleMotion } from '../hooks/scrollMotion'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

export default function TypewriterSection({ innerRef, text, mode = 'type', onNext, onBack, n, followUp }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)
  const progress = useScrollProgress(ref)
  const motion = titleMotion(progress, 40)

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
        backgroundSize: '20vw auto',
        backgroundPosition: '0 0',
        opacity: 0.35,
        animation: 'scrollRight 7s linear infinite',
      }} />

      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        width: mode === 'fade' ? 'min(920px, 85vw)' : 'min(780px, 80vw)',
        maxHeight: '78vh', overflowY: 'auto',
        padding: '0 0.5rem',
      }}>
        <p style={{
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: mode === 'fade' ? 'clamp(0.85rem, 1.5vw, 1.4rem)' : 'clamp(1.1rem, 2.6vw, 2.4rem)',
          fontWeight: 400,
          color: '#1a1a1a',
          letterSpacing: '0.03em',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
          margin: 0,
          opacity: visible ? 1 : 0,
          transition: mode === 'fade' ? 'opacity 1.4s ease' : 'none',
        }}>
          {displayText}
          {mode === 'type' && !done && <span className="cursor" style={{ background: '#1a1a1a' }} />}
        </p>

        {followUp && (
          <div style={{
            marginTop: '3rem',
            opacity: done ? motion.opacity : 0,
            transform: motion.transform,
            transition: 'opacity 0.8s ease',
          }}>
            <div style={{ borderTop: '2px solid #a82b39', width: '3.5rem', margin: '0 auto 1.2rem' }} />
            <h2 style={{
              fontFamily: "'BBTorsosPro', sans-serif",
              fontSize: 'clamp(2rem, 5.5vw, 5rem)',
              fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.02em', color: '#a82b39',
              margin: 0, lineHeight: 0.95,
            }}>
              {followUp.title}
            </h2>
            {followUp.subtitle && (
              <p style={{
                fontFamily: "'BBTorsosPro', sans-serif",
                fontSize: '0.9rem', color: '#8A6A6A',
                letterSpacing: '0.05em', marginTop: '0.8rem',
              }}>
                {'// ' + followUp.subtitle.toLowerCase()}
              </p>
            )}
          </div>
        )}
      </div>

      {n && <SectionIndex n={n} />}
      {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
      <ScrollDownPrompt visible={done} onClick={onNext} />
    </section>
  )
}

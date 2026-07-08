import { useState, useEffect, useRef } from 'react'
import useInView from '../hooks/useInView'
import SectionIndex from './SectionIndex'
import ScrollDownPrompt from './ScrollDownPrompt'

export default function IntroSection({ innerRef, onNext, onBack, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  const [visible, setVisible] = useState(false)
  const [showBtn, setShowBtn] = useState(false)

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setVisible(true), 80)
    const t2 = setTimeout(() => setShowBtn(true), 2800)
    return () => [t1, t2].forEach(clearTimeout)
  }, [inView])

  return (
    <section ref={attachRef} className="snap-section" style={{ background: '#fff' }}>
      {/* Slide image */}
      <img
        src={`${import.meta.env.BASE_URL}images/INTROSLIDE.webp`}
        alt="Agentic Square intro slide"
        draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.8s ease',
          userSelect: 'none',
        }}
      />

      {/* Left-side text panel */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '4%',
        transform: 'translateY(-50%)',
        width: '34%',
        zIndex: 10,
        opacity: visible ? 1 : 0,
        transition: 'opacity 2.2s ease 0.3s',
        pointerEvents: 'none',
      }}>
        <h1 style={{
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: 'clamp(2rem, 3.4rem, 5.4rem)',
          fontWeight: 400,
          color: '#a82b39',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 0.9,
          margin: '0 0 1.6rem 0',
        }}>
          AGENTIC<br />SQUARE
        </h1>

        <p style={{
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: 'clamp(0.85rem, 1.08rem, 1.25rem)',
          fontWeight: 600,
          color: '#111',
          letterSpacing: '0.01em',
          lineHeight: 1.5,
          margin: '0 0 1.2rem 0',
        }}>
          AI guides.<br />
          Communities build.<br />
          Government supports.
        </p>

        <p style={{
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: 'clamp(0.68rem, 0.82rem, 0.94rem)',
          fontWeight: 400,
          color: '#444',
          letterSpacing: '0.01em',
          lineHeight: 1.65,
          margin: 0,
        }}>
          Empowering neighborhoods to design and build their own public space
          with simple materials, AI guidance and public funding, turning empty
          spaces into shared places.
        </p>
      </div>

      {/* Explore button */}
      <div style={{
        position: 'absolute',
        bottom: '3.5rem', left: '50%',
        transform: 'translateX(-50%)',
        opacity: showBtn ? 1 : 0,
        transition: 'opacity 0.9s ease',
        pointerEvents: showBtn ? 'all' : 'none',
        zIndex: 20,
      }}>
        <button className="explore-btn" onClick={onNext}>EXPLORE</button>
      </div>

      {n && <SectionIndex n={n} dark />}
      {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
    </section>
  )
}

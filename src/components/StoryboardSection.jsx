import { useRef } from 'react'
import useInView from '../hooks/useInView'
import TitleHeader from './TitleHeader'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

export default function StoryboardSection({ innerRef, onNext, onBack, n, text }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  const hasText = Boolean(text)

  return (
    <section ref={attachRef} className="snap-section" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <TitleHeader title="Design Storyboard" active={inView} />
      <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 0, overflow: 'hidden', background: '#fff' }}>
          <img
            src={`${import.meta.env.BASE_URL}images/storyboard.gif`}
            alt="Design storyboard"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'center',
            }}
          />
          {n && <SectionIndex n={n} />}
          {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
        </div>

        {hasText && (
          <p className={`reveal-up${inView ? ' is-in' : ''}`} style={{
            flexShrink: 0, margin: 0, padding: '1.1rem 4rem 6.5rem',
            textAlign: 'center', maxWidth: '760px', alignSelf: 'center',
            fontFamily: "'BBTorsosPro', sans-serif",
            fontSize: '0.8rem', lineHeight: 1.6,
            color: '#555',
          }}>
            {text}
          </p>
        )}
      </div>
      <ScrollDownPrompt visible={inView} onClick={onNext} />
    </section>
  )
}

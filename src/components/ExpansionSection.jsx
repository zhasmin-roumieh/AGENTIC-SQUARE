import { useRef } from 'react'
import useInView from '../hooks/useInView'
import TitleHeader from './TitleHeader'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

const EXPANSION_TEXT =
  'Citizens choose their own site of intervention and its size. We expect the project to expand from one location to another, and from one season to the next. People hold the agency to shape their own spaces — AI only assists.'

export default function ExpansionSection({ innerRef, onRestart, onBack, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  return (
    <section ref={attachRef} className="snap-section" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <TitleHeader title="Expansion" active={inView} />
      <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
          <img
            src={`${import.meta.env.BASE_URL}images/spread.gif`}
            alt="Expansion"
            className={`reveal-img${inView ? ' is-in' : ''}`}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'center',
            }}
          />
          {n && <SectionIndex n={n} />}
          {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
        </div>

        <p className={`reveal-up${inView ? ' is-in' : ''}`} style={{
          flexShrink: 0, margin: 0, padding: '1.1rem 4rem 6.5rem',
          textAlign: 'center', maxWidth: '760px', alignSelf: 'center',
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: '0.8rem', lineHeight: 1.6,
          color: '#555',
        }}>
          {EXPANSION_TEXT}
        </p>
      </div>
      <ScrollDownPrompt visible={inView} onClick={onRestart} label="RESTART" icon="↻" />
    </section>
  )
}

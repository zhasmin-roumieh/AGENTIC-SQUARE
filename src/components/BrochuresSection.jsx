import { useRef } from 'react'
import useInView from '../hooks/useInView'
import BrochuresGrid from './BrochuresGrid'
import TitleHeader from './TitleHeader'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

export default function BrochuresSection({ innerRef, onNext, onBack, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  return (
    <section ref={attachRef} className="snap-section" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <TitleHeader title="Brochures" active={inView} />
      <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden' }}>
        <p style={{
          position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#8A8A8A', zIndex: 5, margin: 0, textAlign: 'center',
        }}>
          Tap a brochure to view the full document
        </p>
        <BrochuresGrid />
        {n && <SectionIndex n={n} />}
        {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
      </div>
      <ScrollDownPrompt visible={inView} onClick={onNext} />
    </section>
  )
}

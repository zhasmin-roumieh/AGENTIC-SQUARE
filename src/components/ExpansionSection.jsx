import { useRef } from 'react'
import useInView from '../hooks/useInView'
import TitleHeader from './TitleHeader'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

export default function ExpansionSection({ innerRef, onRestart, onBack, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  return (
    <section ref={attachRef} className="snap-section" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <TitleHeader title="Expansion" active={inView} />
      <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden' }}>
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
      <ScrollDownPrompt visible={inView} onClick={onRestart} label="RESTART" icon="↻" />
    </section>
  )
}

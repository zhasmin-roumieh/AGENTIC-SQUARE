import { useRef } from 'react'
import useInView from '../hooks/useInView'
import CompareSlider from './CompareSlider'
import TitleHeader from './TitleHeader'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

export default function CompareSliderSection({
  innerRef, eyebrow, title, imageA, labelA, imageB, labelB, onNext, onBack, n,
  downloadA, downloadB,
}) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  const downloads = [
    downloadA && { url: downloadA, label: `${labelA} (PDF)` },
    downloadB && { url: downloadB, label: `${labelB} (PDF)` },
  ].filter(Boolean)

  return (
    <section ref={attachRef} className="snap-section" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <TitleHeader eyebrow={eyebrow} title={title} active={inView} />
      <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden' }}>
        <CompareSlider imageA={imageA} labelA={labelA} imageB={imageB} labelB={labelB} />
        {n && <SectionIndex n={n} />}
        {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}

        {downloads.length > 0 && (
          <div style={{
            position: 'absolute', bottom: '2.5rem', left: '2.5rem', zIndex: 10,
            display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start',
          }}>
            {downloads.map(d => (
              <a
                key={d.url}
                href={d.url}
                download
                data-cursor-hover
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
                  border: 'none', borderRadius: '100px', padding: '0.6rem 1.2rem',
                  textDecoration: 'none', cursor: 'pointer',
                  fontFamily: "'BBTorsosPro', sans-serif",
                  fontSize: '0.65rem', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#1a1a1a',
                }}
              >
                <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>↓</span>
                <span>{d.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
      <ScrollDownPrompt visible={inView} onClick={onNext} />
    </section>
  )
}

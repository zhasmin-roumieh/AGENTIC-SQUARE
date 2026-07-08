import { useRef } from 'react'
import useInView from '../hooks/useInView'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'
import TitleHeader from './TitleHeader'

export default function ImageSection({ innerRef, src, alt = '', eyebrow, title, text, textPosition = 'none', fit = 'cover', onNext, onBack, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  const hasText = Boolean(text)
  const isContain = fit === 'contain'

  return (
    <section ref={attachRef} className="snap-section" style={{
      display: 'flex', flexDirection: 'column', background: '#fff',
    }}>
      <TitleHeader eyebrow={eyebrow} title={title} active={inView} />

      <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden', background: isContain ? '#fff' : 'transparent' }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`reveal-img${inView ? ' is-in' : ''}`}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: fit,
          }}
        />

        {hasText && (
          <div style={{
            position: 'absolute', top: '50%',
            right: textPosition === 'left' ? 'auto' : '4rem',
            left: textPosition === 'left' ? '4rem' : 'auto',
            transform: 'translateY(-50%)',
            width: 'min(440px, 32rem)',
            maxHeight: '80%',
            zIndex: 5,
          }}>
            <div className={`reveal-up${inView ? ' is-in' : ''}`} style={{
              maxHeight: '100%', overflowY: 'auto',
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
              borderRadius: '18px', padding: '2rem',
            }}>
              {text.map((p, i) => (
                <p key={i} style={{
                  fontFamily: "'BBTorsosPro', sans-serif",
                  fontSize: '0.95rem', lineHeight: 1.65,
                  color: '#1a1a1a', margin: i === 0 ? 0 : '1rem 0 0',
                }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {n && <SectionIndex n={n} dark={!isContain} />}
        {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
      </div>

      {onNext && <ScrollDownPrompt visible={inView} onClick={onNext} />}
    </section>
  )
}

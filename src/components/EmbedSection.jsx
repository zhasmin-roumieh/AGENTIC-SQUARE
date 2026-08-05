import { useRef, useState, useEffect } from 'react'
import useInView from '../hooks/useInView'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'
import TitleHeader from './TitleHeader'

// AR ("View in Your Space") only works on phones/tablets with ARKit/ARCore —
// desktop browsers can't launch it at all, so clicking the AR icon there
// just does nothing with no error. `pointer: coarse` is a good proxy for
// "touch device" (phone/tablet) vs "mouse device" (laptop/desktop).
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(true)
  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])
  return isTouch
}

export default function EmbedSection({ innerRef, eyebrow, title, url, arNotice, onNext, onBack, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)
  const isTouch = useIsTouchDevice()

  return (
    <section ref={attachRef} className="snap-section" style={{
      display: 'flex', flexDirection: 'column', background: '#fff',
    }}>
      <TitleHeader eyebrow={eyebrow} title={title} active={inView} />

      {arNotice && !isTouch && (
        <div style={{
          flexShrink: 0, background: '#a82b39', color: '#fff',
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: '0.8rem', letterSpacing: '0.04em',
          padding: '0.7rem 4rem', textAlign: 'center',
        }}>
          AR only works on a phone or tablet — open this on one to view items in your space.
        </div>
      )}

      <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden', background: '#111' }}>
        {/* Only mount the iframe once this slide has actually been seen, so
            we're not running two live 3D/AR sites' worth of WebGL at once. */}
        {inView && (
          <iframe
            src={url}
            title={title}
            allow="xr-spatial-tracking; camera; accelerometer; gyroscope; magnetometer"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        )}

        {n && <SectionIndex n={n} />}
        {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
      </div>

      {onNext && <ScrollDownPrompt visible={inView} onClick={onNext} />}
    </section>
  )
}

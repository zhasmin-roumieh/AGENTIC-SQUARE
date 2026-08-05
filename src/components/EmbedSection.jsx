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

export default function EmbedSection({ innerRef, eyebrow, title, url, arNotice, allowRestart, onNext, onBack, n }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)
  const isTouch = useIsTouchDevice()
  // Bumping this remounts the iframe, giving it a fresh session — the
  // embedded app is a different origin, so this is the only way to "restart"
  // it (we can't reach into its state or know when a chat has finished).
  const [restartKey, setRestartKey] = useState(0)

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
            key={restartKey}
            src={url}
            title={title}
            allow="xr-spatial-tracking; camera; accelerometer; gyroscope; magnetometer"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        )}

        {allowRestart && (
          <button
            onClick={() => setRestartKey(k => k + 1)}
            data-cursor-hover
            style={{
              position: 'absolute', top: '1.2rem', left: '1.2rem', zIndex: 20,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(20,20,20,0.75)', border: 'none', borderRadius: '100px',
              color: '#fff', cursor: 'pointer',
              fontFamily: "'BBTorsosPro', sans-serif",
              fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.6rem 1.1rem',
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>↻</span>
            <span>Restart Chat</span>
          </button>
        )}

        {n && <SectionIndex n={n} />}
        {onBack && (
          <ScrollDownPrompt
            visible={inView} onClick={onBack} label="Back" icon="↑" position="top"
            // The chat app anchors its own phone mockup to the top-right
            // corner, right where Back normally sits — move Back to the
            // left (stacked under Restart Chat) whenever that's on screen.
            side={allowRestart ? 'left' : 'right'}
            style={allowRestart ? { top: '3.6rem' } : undefined}
          />
        )}
      </div>

      {onNext && <ScrollDownPrompt visible={inView} onClick={onNext} />}
    </section>
  )
}

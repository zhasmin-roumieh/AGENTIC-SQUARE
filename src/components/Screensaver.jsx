import { useEffect, useRef, useState } from 'react'
import ThreeDView from './ThreeDView'

const BASE = import.meta.env.BASE_URL
const IMAGE_DURATION = 5000
const MODEL_ORBIT_DURATION = 30000

// The attract-mode sequence — shown on a loop once the site has been idle,
// dismissed instantly by any touch/click/scroll/key press.
const STEPS = [
  { type: 'image', src: `${BASE}images/screensaver/01-site.webp` },
  { type: 'image', src: `${BASE}images/screensaver/02-view.webp` },
  { type: 'image', src: `${BASE}images/screensaver/03-iso.webp` },
  { type: '3d' },
  { type: 'image', src: `${BASE}images/screensaver/05-westhagen-plays.webp` },
  { type: 'image', src: `${BASE}images/screensaver/06-urban-gardening.webp` },
  { type: 'image', src: `${BASE}images/screensaver/07-wine-fest.webp` },
  // Zoomed out (not cropped) — this one's a flat brochure grid, not a
  // full-bleed scene, so it needs to stay fully visible with letterboxing
  // instead of being cover-cropped like the others.
  { type: 'image', src: `${BASE}images/screensaver/08-brochures.webp`, fit: 'contain', bg: '#fff' },
]

export default function Screensaver() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  // Guards against a step being advanced twice in a row (e.g. React
  // StrictMode's dev-only double-mount briefly running the 3D loader
  // twice) — only the first advance() call per step is allowed through,
  // so a stray duplicate can never silently skip the next step.
  const advancedRef = useRef(false)
  useEffect(() => { advancedRef.current = false }, [step])
  const advance = () => {
    if (advancedRef.current) return
    advancedRef.current = true
    setStep(s => (s + 1) % STEPS.length)
  }

  // Image steps advance on a fixed timer. The 3D step advances itself once
  // the model finishes loading, via its own onLoaded callback below, so the
  // full 30s of orbiting is never eaten into by load time.
  useEffect(() => {
    if (current.type !== 'image') return
    const timer = setTimeout(advance, IMAGE_DURATION)
    return () => clearTimeout(timer)
  }, [step])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: current.bg || '#000' }}>
      {current.type === 'image' ? (
        <img
          key={current.src}
          src={current.src}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: current.fit || 'cover',
            animation: 'fadeIn 1s ease',
          }}
        />
      ) : (
        <div key="3d" style={{ position: 'absolute', inset: 0 }}>
          <ThreeDView
            interactive={false}
            autoZoomMs={MODEL_ORBIT_DURATION}
            onLoaded={() => setTimeout(advance, MODEL_ORBIT_DURATION)}
          />
        </div>
      )}
    </div>
  )
}

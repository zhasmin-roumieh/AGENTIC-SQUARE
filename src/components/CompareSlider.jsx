import { useRef, useState } from 'react'

export default function CompareSlider({ imageA, labelA, imageB, labelB }) {
  const [pct, setPct] = useState(50)
  const draggingRef = useRef(false)
  const containerRef = useRef(null)

  const updateFromClientX = clientX => {
    const rect = containerRef.current.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPct(Math.max(0, Math.min(100, next)))
  }

  const onPointerDown = e => {
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = true
    updateFromClientX(e.clientX)
  }
  const onPointerMove = e => { if (draggingRef.current) updateFromClientX(e.clientX) }
  const onPointerUp = () => { draggingRef.current = false }

  const labelStyle = {
    position: 'absolute', top: '1.2rem',
    fontFamily: "'BBTorsosPro', sans-serif",
    fontSize: '0.7rem', fontWeight: 600,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    color: '#1a1a1a', background: 'rgba(255,255,255,0.85)',
    padding: '0.5rem 1.1rem', borderRadius: '100px',
    pointerEvents: 'none',
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'relative', width: '100%', height: '100%',
        overflow: 'hidden', touchAction: 'none', userSelect: 'none',
        cursor: 'ew-resize', background: '#fff',
      }}
    >
      {/* imageB is the full base layer (shows through on the right); imageA
          is clipped on top so it only shows on the left, matching labelA
          (left) / labelB (right) below. */}
      <img
        src={imageB}
        alt={labelB}
        draggable={false}
        loading="lazy"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <img
        src={imageA}
        alt={labelA}
        draggable={false}
        loading="lazy"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
        }}
      />

      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: `${pct}%`, width: '3px',
        background: '#fff', transform: 'translateX(-50%)', pointerEvents: 'none',
        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)',
        width: '2.8rem', height: '2.8rem', borderRadius: '50%', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        fontSize: '1.1rem', boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
      }}>
        ⇔
      </div>

      {labelA && <div style={{ ...labelStyle, left: '1.2rem' }}>{labelA}</div>}
      {labelB && <div style={{ ...labelStyle, right: '1.2rem' }}>{labelB}</div>}
    </div>
  )
}

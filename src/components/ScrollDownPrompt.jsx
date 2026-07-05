import { useRef } from 'react'

// Magnetic pull toward the pointer (mouse/trackpad only) — the button
// leans slightly toward the cursor within its own bounds, snapping back
// on leave. No effect on touch, since there's no hover/pointer position.
function useMagnetic(centered) {
  const ref = useRef(null)
  const base = centered ? '-50%' : '0px'
  const onMouseMove = e => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate(calc(${base} + ${x * 0.25}px), ${y * 0.25}px)`
  }
  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = `translate(${base}, 0)`
  }
  return { ref, onMouseMove, onMouseLeave, base }
}

export default function ScrollDownPrompt({ visible, onClick, label = 'NEXT', icon = '↓', position = 'bottom', side = 'right' }) {
  const magnetic = useMagnetic(position === 'bottom')

  return (
    <button
      ref={magnetic.ref}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      onClick={onClick}
      data-cursor-hover
      className="hint-pulse"
      style={{
        position: 'absolute',
        ...(position === 'bottom'
          ? { bottom: '3rem', left: '50%' }
          : side === 'left' ? { top: '2rem', left: '2.5rem' } : { top: '2rem', right: '2.5rem' }),
        transform: `translate(${magnetic.base}, 0)`,
        display: visible ? 'flex' : 'none',
        flexDirection: position === 'bottom' ? 'column' : (side === 'left' ? 'row' : 'row-reverse'),
        alignItems: 'center', gap: '0.4rem',
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#fff', mixBlendMode: 'difference',
        fontFamily: "'BBTorsosPro', sans-serif",
        fontSize: '0.75rem', fontWeight: 400,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        zIndex: 10, padding: '0.7rem 1.2rem',
        transition: 'transform 0.15s ease-out, color 0.2s ease',
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{icon}</span>
    </button>
  )
}

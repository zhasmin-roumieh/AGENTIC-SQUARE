import { useEffect, useRef } from 'react'

// A small ring that eases toward the pointer and grows over anything
// tappable/clickable. Mouse/trackpad only — index.css hides it entirely
// on touch devices via `@media (pointer: fine)`, so this never gets in
// the way of the touch-first interactions.
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let hovering = false

    const onMove = e => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`

      const target = e.target.closest('button, a, [data-cursor-hover]')
      const next = Boolean(target)
      if (next !== hovering) {
        hovering = next
        ring.style.width = hovering ? '3.2rem' : '1.8rem'
        ring.style.height = hovering ? '3.2rem' : '1.8rem'
        ring.style.borderColor = hovering ? '#a82b39' : 'rgba(0,0,0,0.35)'
        dot.style.opacity = hovering ? '0' : '1'
      }
    }

    let frameId
    const animate = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      frameId = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frameId)
    }
  }, [])

  if (!window.matchMedia('(pointer: fine)').matches) return null

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '5px', height: '5px', borderRadius: '50%',
        background: '#a82b39', zIndex: 9999, pointerEvents: 'none',
        transition: 'opacity 0.2s ease',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '1.8rem', height: '1.8rem', borderRadius: '50%',
        border: '1.5px solid rgba(0,0,0,0.35)',
        zIndex: 9999, pointerEvents: 'none',
        transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease',
      }} />
    </>
  )
}

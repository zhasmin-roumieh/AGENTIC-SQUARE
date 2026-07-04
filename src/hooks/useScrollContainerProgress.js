import { useEffect, useRef, useState } from 'react'

// Tracks overall scroll position of the app's single scrolling container
// as a 0-1 value, for the wayfinding rail on the side of the screen.
// Polled via requestAnimationFrame rather than the 'scroll' event, since
// some browsers don't fire continuous scroll events while a CSS
// scroll-snap animation is settling — polling always reflects the live
// position no matter how the scroll happened (touch, wheel, or tap-nav).
export default function useScrollContainerProgress() {
  const [progress, setProgress] = useState(0)
  const lastRef = useRef(0)

  useEffect(() => {
    const el = document.querySelector('.scroll-container')
    if (!el) return

    let frameId
    const tick = () => {
      const max = el.scrollHeight - el.clientHeight
      const next = max > 0 ? el.scrollTop / max : 0
      if (Math.abs(next - lastRef.current) > 0.0005) {
        lastRef.current = next
        setProgress(next)
      }
      frameId = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frameId)
  }, [])

  return progress
}

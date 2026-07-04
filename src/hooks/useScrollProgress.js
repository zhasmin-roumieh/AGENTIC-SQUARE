import { useEffect, useRef, useState } from 'react'

// Continuous 0-1 value tracking a section's transit through the viewport:
// 0 = just entering from the bottom, 0.5 = filling the viewport, 1 = fully
// scrolled past. Used to drive scroll-tied motion (parallax, fade) on titles.
export default function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    const container = document.querySelector('.scroll-container')
    const node = ref.current
    if (!container || !node) return

    const measure = () => {
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight
      const raw = (vh - rect.top) / (vh + rect.height)
      setProgress(Math.max(0, Math.min(1, raw)))
    }

    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        measure()
        frame.current = null
      })
    }

    measure()
    container.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [ref])

  return progress
}

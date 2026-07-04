import { useEffect, useState } from 'react'

export default function useInView(ref, { threshold = 0.5, once = true, rootMargin = '0px' } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold, once, rootMargin])

  return inView
}

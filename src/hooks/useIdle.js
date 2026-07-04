import { useEffect, useState } from 'react'

// True once the visitor hasn't touched/clicked/scrolled/typed for
// `timeoutMs` — resets (and the screensaver dismisses) the instant any
// activity happens again.
export default function useIdle(timeoutMs) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let timer
    const reset = () => {
      setIdle(false)
      clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), timeoutMs)
    }
    const events = ['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart']
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    reset()
    return () => {
      clearTimeout(timer)
      events.forEach(e => window.removeEventListener(e, reset))
    }
  }, [timeoutMs])

  return idle
}

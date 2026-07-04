import { useState, useEffect, useRef } from 'react'

export default function useTypewriter(text, active, { speed = 45, jitter = 35, startDelay = 200 } = {}) {
  const [displayText, setDisplayText] = useState('')
  const [done, setDone] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!active) return
    let i = 0
    const type = () => {
      i++
      setDisplayText(text.slice(0, i))
      if (i < text.length) {
        timer.current = setTimeout(type, speed + Math.random() * jitter)
      } else {
        setDone(true)
      }
    }
    timer.current = setTimeout(type, startDelay)
    return () => clearTimeout(timer.current)
  }, [active, text, speed, jitter, startDelay])

  return { displayText, done }
}

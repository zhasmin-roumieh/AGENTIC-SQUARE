import { useState } from 'react'

const SCENARIOS = [
  'URBAN GADENING',
  'WINE FEST',
  'WETHAGEN PLAYS',
]

export default function ScenariosCarousel() {
  const [index, setIndex] = useState(0)
  const title = SCENARIOS[index]
  const go = dir => setIndex(i => (i + dir + SCENARIOS.length) % SCENARIOS.length)

  const arrowStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: '3rem', height: '3rem', borderRadius: '50%',
    background: 'rgba(255,255,255,0.85)', border: '2px solid #1a1a1a',
    color: '#1a1a1a', fontSize: '1.3rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s, color 0.2s', zIndex: 20,
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F0EDE5' }}>
      <img
        key={title}
        src={`${import.meta.env.BASE_URL}images/scenarios/${encodeURIComponent(title)}.webp`}
        alt={title}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'contain', objectPosition: 'center',
        }}
      />

      <div style={{
        position: 'absolute', top: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'BBTorsosPro', sans-serif",
        fontSize: '0.95rem', fontWeight: 600,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#1a1a1a', zIndex: 20,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
        padding: '0.6rem 1.6rem', borderRadius: '100px',
      }}>
        {title}
      </div>

      <button
        onClick={() => go(-1)}
        style={{ ...arrowStyle, left: '2rem' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.color = '#1a1a1a' }}
      >‹</button>
      <button
        onClick={() => go(1)}
        style={{ ...arrowStyle, right: '2rem' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.color = '#1a1a1a' }}
      >›</button>

      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '0.5rem', zIndex: 20,
      }}>
        {SCENARIOS.map((s, i) => (
          <div key={s} style={{
            width: '0.5rem', height: '0.5rem', borderRadius: '50%',
            background: i === index ? '#1a1a1a' : 'rgba(26,26,26,0.25)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
    </div>
  )
}

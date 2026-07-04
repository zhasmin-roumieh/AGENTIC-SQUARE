// Thin fixed rail on the right edge showing overall position in the
// presentation — a quiet wayfinding cue that stays put across all sections.
export default function ScrollProgressRail({ progress }) {
  return (
    <div style={{
      position: 'fixed', top: '12vh', bottom: '12vh', right: '1.4rem',
      width: '2px', zIndex: 40, pointerEvents: 'none',
      background: 'rgba(0,0,0,0.1)',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, width: '100%',
        height: `${Math.min(100, Math.max(0, progress * 100))}%`,
        background: '#a82b39',
        transition: 'height 0.15s linear',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: `${Math.min(100, Math.max(0, progress * 100))}%`,
        width: '7px', height: '7px', borderRadius: '50%',
        background: '#a82b39',
        transform: 'translate(-50%, -50%)',
        transition: 'top 0.15s linear',
      }} />
    </div>
  )
}

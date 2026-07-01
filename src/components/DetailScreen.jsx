import ThreeDView from './ThreeDView'
import ScenariosCarousel from './ScenariosCarousel'
import BrochuresGrid from './BrochuresGrid'

export default function DetailScreen({ active, selected, onBack }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#FFFFFF',
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 0.5s ease',
    }}>
      {selected === '3D View' && (
        <ThreeDView />
      )}

      {selected === 'Scenarios' && (
        <ScenariosCarousel />
      )}

      {selected === 'Brochures' && (
        <BrochuresGrid />
      )}

      {selected === 'Building Storyboard' && (
        <img
          src={`${import.meta.env.BASE_URL}images/storyboard.webp`}
          alt="Building storyboard"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'contain', objectPosition: 'center',
            background: '#F0EDE5',
          }}
        />
      )}

      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '2.5rem', left: '2.5rem',
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: '0.75rem', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(6px)',
          border: '2px solid #1a1a1a', color: '#1a1a1a',
          padding: '0.6rem 1.4rem', borderRadius: '100px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
          zIndex: 100,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.color = '#1a1a1a' }}
      >
        ← BACK
      </button>
    </div>
  )
}

// Persistent "return to home" control, fixed on screen across every
// section (not just reachable by scrolling Back through the whole deck).
export default function HomeButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      data-cursor-hover
      style={{
        position: 'fixed', bottom: '3rem', left: '2.5rem', zIndex: 45,
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#8A8A8A',
        fontFamily: "'BBTorsosPro', sans-serif",
        fontSize: '0.75rem', fontWeight: 400,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        padding: '0.7rem 1.2rem',
      }}
    >
      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>⌂</span>
      <span>Home</span>
    </button>
  )
}

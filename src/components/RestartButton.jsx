// Persistent "restart" control, fixed on screen across every section except
// the cover — reloads the page so the whole site comes back exactly as it
// was on first load (same as a manual browser refresh).
export default function RestartButton() {
  return (
    <button
      onClick={() => window.location.reload()}
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
      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>↻</span>
      <span>Restart</span>
    </button>
  )
}

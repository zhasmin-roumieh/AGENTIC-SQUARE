export default function SectionIndex({ n, total = 15, dark = false }) {
  return (
    <div style={{
      position: 'absolute', bottom: '2.5rem', right: '2.5rem',
      fontFamily: "'BBTorsosPro', sans-serif",
      fontSize: 'clamp(1.8rem, 2.8rem, 3rem)',
      fontWeight: 700,
      lineHeight: 1,
      color: dark ? 'rgba(255,255,255,0.28)' : 'rgba(196,30,58,0.18)',
      userSelect: 'none',
      pointerEvents: 'none',
      zIndex: 3,
    }}>
      {String(n).padStart(2, '0')}<span style={{ opacity: 0.6 }}>/{String(total).padStart(2, '0')}</span>
    </div>
  )
}

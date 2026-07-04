import useTypewriter from '../hooks/useTypewriter'

export default function TitleHeader({ eyebrow, title, active, dark = false }) {
  const { displayText, done } = useTypewriter(title || '', active && Boolean(title))

  if (!title) return null

  return (
    <div style={{
      flexShrink: 0, padding: '3.5rem 4rem 2rem', position: 'relative', overflow: 'hidden',
      background: dark ? '#111' : '#fff',
    }}>
      <span
        className="ghost-title"
        aria-hidden="true"
        style={{
          top: '-0.3em', left: '3.5rem',
          fontSize: 'clamp(4rem, 14vw, 13rem)',
          color: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)',
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {title}
      </span>
      <div style={{ borderTop: '2px solid #a82b39', width: '3.5rem', marginBottom: '1.2rem', position: 'relative' }} />
      {eyebrow && (
        <p style={{
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: '1rem', fontWeight: 400,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#8A8A8A', margin: '0 0 0.4rem', position: 'relative',
        }}>
          {'// ' + eyebrow}
        </p>
      )}
      <h2 style={{
        fontFamily: "'BBTorsosPro', sans-serif",
        fontSize: 'clamp(2.5rem, 6.5vw, 6rem)',
        fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.01em', color: '#a82b39',
        margin: 0, lineHeight: 0.95, minHeight: '1em', position: 'relative',
      }}>
        {displayText}
        {!done && <span className="cursor" style={{ background: '#a82b39' }} />}
      </h2>
    </div>
  )
}

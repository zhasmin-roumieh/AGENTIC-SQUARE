import useTypewriter from '../hooks/useTypewriter'

export default function TitleHeader({ eyebrow, title, active, dark = false }) {
  const { displayText, done } = useTypewriter(title || '', active && Boolean(title))

  if (!title) return null

  return (
    <div style={{
      flexShrink: 0, padding: '3.5rem 4rem 2rem', position: 'relative', overflow: 'hidden',
      background: dark ? '#111' : '#fff',
    }}>
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
        // Sized so even the longest title ("Urban Gardening & Wine Fest")
        // fits on one line — if it wraps to two lines mid-typewriter, the
        // header grows taller and steals height from the image below it
        // (both share a fixed-height section via flexbox).
        fontSize: 'clamp(2.2rem, 3.2rem, 4.5rem)',
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

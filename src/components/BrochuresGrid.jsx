import { useState } from 'react'
import PdfViewer from './PdfViewer'

const BROCHURES = [
  { thumb: 'bricks.webp',          pdf: 'bricks.pdf',          label: 'Stepped Brick Playground' },
  { thumb: 'wooden-pallets.webp',  pdf: 'wooden-pallets.pdf',  label: 'Wood Pallets' },
  { thumb: 'wooden-stand.webp',    pdf: 'wooden-stand.pdf',    label: 'Selling Stand' },
  { thumb: 'wooden-bench.webp',    pdf: 'wooden-bench.pdf',    label: 'Bench Setting' },
]

export default function BrochuresGrid() {
  const [openBrochure, setOpenBrochure] = useState(null)

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#F0EDE5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '2rem', padding: '4rem',
    }}>
      {BROCHURES.map(b => (
        <button
          key={b.pdf}
          onClick={() => setOpenBrochure(b)}
          className="brochure-thumb-btn"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', flex: '1 1 0', maxWidth: '260px',
          }}
        >
          <div style={{
            width: '100%', aspectRatio: '654 / 922',
            borderRadius: '14px', overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          }}>
            <img
              src={`${import.meta.env.BASE_URL}images/brochures/${b.thumb}`}
              alt={b.label}
              className="brochure-thumb-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span style={{
            fontFamily: "'BBTorsosPro', sans-serif",
            fontSize: '0.7rem', fontWeight: 600,
            letterSpacing: '0.13em', textTransform: 'uppercase',
            color: '#1a1a1a', textAlign: 'center',
          }}>
            {b.label}
          </span>
        </button>
      ))}

      {openBrochure && (
        <PdfViewer
          url={`${import.meta.env.BASE_URL}brochures/${openBrochure.pdf}`}
          title={openBrochure.label}
          downloadName={`${openBrochure.label}.pdf`}
          onClose={() => setOpenBrochure(null)}
        />
      )}
    </div>
  )
}

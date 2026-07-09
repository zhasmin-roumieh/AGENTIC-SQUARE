import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export default function PdfViewer({ url, title, downloadName, onClose }) {
  const canvasRef = useRef(null)
  const docRef = useRef(null)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    pdfjsLib.getDocument({ url }).promise.then(doc => {
      if (cancelled) return
      docRef.current = doc
      setNumPages(doc.numPages)
      setPageNum(1)
    }).catch(err => console.error('Failed to load PDF:', err))
    return () => { cancelled = true }
  }, [url])

  useEffect(() => {
    if (!docRef.current || !canvasRef.current || numPages === 0) return
    let cancelled = false
    setLoading(true)
    docRef.current.getPage(pageNum).then(page => {
      if (cancelled) return
      const viewport = page.getViewport({ scale: 2.2 })
      const canvas = canvasRef.current
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        if (!cancelled) setLoading(false)
      })
    })
    return () => { cancelled = true }
  }, [pageNum, numPages])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') setPageNum(p => Math.min(numPages, p + 1))
      if (e.key === 'ArrowLeft') setPageNum(p => Math.max(1, p - 1))
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [numPages, onClose])

  const navBtnStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: '3rem', height: '3rem', borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.5)',
    color: '#fff', fontSize: '1.4rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s', zIndex: 5,
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(20,20,20,0.96)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.4rem 2rem', flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            fontFamily: "'BBTorsosPro', sans-serif",
            fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            background: 'transparent', border: '2px solid #fff', color: '#fff',
            padding: '0.6rem 1.4rem', borderRadius: '100px', cursor: 'pointer',
          }}
        >
          ← Back
        </button>

        <div style={{
          fontFamily: "'BBTorsosPro', sans-serif",
          fontSize: '0.8rem', fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#fff',
        }}>
          {title}
        </div>

        <a
          href={url}
          download={downloadName}
          style={{
            fontFamily: "'BBTorsosPro', sans-serif",
            fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            background: '#fff', color: '#1a1a1a',
            padding: '0.6rem 1.4rem', borderRadius: '100px',
            textDecoration: 'none', cursor: 'pointer',
          }}
        >
          Download
        </a>
      </div>

      {/* Page area */}
      <div style={{
        flex: 1, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', padding: '0 5rem 2rem',
      }}>
        <button
          onClick={() => setPageNum(p => Math.max(1, p - 1))}
          disabled={pageNum <= 1}
          style={{ ...navBtnStyle, left: '1.5rem', opacity: pageNum <= 1 ? 0.3 : 1 }}
        >‹</button>

        {loading && (
          <div style={{
            position: 'absolute', color: '#fff',
            fontFamily: "'BBTorsosPro', sans-serif",
            fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            Loading…
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            background: '#fff',
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.25s ease',
          }}
        />

        <button
          onClick={() => setPageNum(p => Math.min(numPages, p + 1))}
          disabled={pageNum >= numPages}
          style={{ ...navBtnStyle, right: '1.5rem', opacity: pageNum >= numPages ? 0.3 : 1 }}
        >›</button>
      </div>

      {/* Page indicator */}
      <div style={{
        textAlign: 'center', color: 'rgba(255,255,255,0.7)', paddingBottom: '1.5rem',
        fontFamily: "'BBTorsosPro', sans-serif", fontSize: '0.7rem', letterSpacing: '0.15em',
      }}>
        {numPages > 0 ? `${pageNum} / ${numPages}` : ''}
      </div>
    </div>
  )
}

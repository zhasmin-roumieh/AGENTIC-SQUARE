import { useRef } from 'react'
import useInView from '../hooks/useInView'
import CompareSlider from './CompareSlider'
import TitleHeader from './TitleHeader'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

export default function CompareSliderSection({
  innerRef, eyebrow, title, imageA, labelA, imageB, labelB, onNext, onBack, n,
}) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)

  return (
    <section ref={attachRef} className="snap-section" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <TitleHeader eyebrow={eyebrow} title={title} active={inView} />
      <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden' }}>
        <CompareSlider imageA={imageA} labelA={labelA} imageB={imageB} labelB={labelB} />
        {n && <SectionIndex n={n} />}
        {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" />}
      </div>
      <ScrollDownPrompt visible={inView} onClick={onNext} />
    </section>
  )
}

import { useRef, useState } from 'react'
import useInView from '../hooks/useInView'
import ThreeDView from './ThreeDView'
import TitleHeader from './TitleHeader'
import ScrollDownPrompt from './ScrollDownPrompt'
import SectionIndex from './SectionIndex'

export default function ExploreDesignSection({ innerRef, onNext, onBack, n, attract = false, modelDwellMs = 0 }) {
  const ref = useRef(null)
  const attachRef = el => { ref.current = el; innerRef?.(el) }
  const inView = useInView(ref)
  // Generous rootMargin so the ~12MB model's download + one-time parse
  // (mesh traversal, shadow setup, bounding-box fit) happens in the
  // background while the visitor is still a section or two away, instead
  // of blocking the main thread right as they arrive.
  const shouldLoad = useInView(ref, { threshold: 0, rootMargin: '200% 0px' })
  // Continuously-updating (not "once") visibility, used only to pause the
  // render loop when scrolled away — `inView` above never reverts to false.
  const isVisible = useInView(ref, { once: false })
  const [loaded, setLoaded] = useState(false)
  // In attract mode, re-trigger the auto-zoom-in orbit fresh every time this
  // slide comes into view (isVisible flips false -> true on every loop of
  // the tour), instead of only once ever.
  const zooming = attract && isVisible

  return (
    <section ref={attachRef} className="snap-section" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <TitleHeader title="Explore Design" active={inView} />
      <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden', background: '#F0EDE5' }}>
        {shouldLoad && (
          <ThreeDView
            onLoaded={() => setLoaded(true)}
            paused={!isVisible}
            interactive={!attract}
            autoZoomMs={zooming ? modelDwellMs : 0}
          />
        )}
        {n && <SectionIndex n={n} />}
        {onBack && <ScrollDownPrompt visible={inView} onClick={onBack} label="Back" icon="↑" position="top" side="left" />}
      </div>
      <ScrollDownPrompt visible={loaded} onClick={onNext} />
    </section>
  )
}

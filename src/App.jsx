import { useEffect, useLayoutEffect, useRef } from 'react'
import useScrollContainerProgress from './hooks/useScrollContainerProgress'
import useIdle from './hooks/useIdle'
import CustomCursor from './components/CustomCursor'
import GrainOverlay from './components/GrainOverlay'
import ScrollProgressRail from './components/ScrollProgressRail'
import RestartButton from './components/RestartButton'
import CoverSection from './components/CoverSection'
import IntroSection from './components/IntroSection'
import TypewriterSection from './components/TypewriterSection'
import ImageSection from './components/ImageSection'
import ExploreDesignSection from './components/ExploreDesignSection'
import StoryboardSection from './components/StoryboardSection'
import CompareSliderSection from './components/CompareSliderSection'
import BrochuresSection from './components/BrochuresSection'
import ExpansionSection from './components/ExpansionSection'

const BASE = import.meta.env.BASE_URL
const IDLE_TIMEOUT_MS = 35 * 1000
// Attract mode: once the site's been idle this long, it tours itself as a
// slideshow — jumping slide to slide with a dwell on each, not a continuous
// scroll. It dwells longer on the 3D section so the model's auto-rotate has
// time to show off, then loops back to the cover. Any touch/click/scroll/key
// press (via useIdle's listeners) cancels it instantly.
const AUTOSCROLL_DWELL_MS = 7000
const AUTOSCROLL_MODEL_DWELL_MS = 26000
const EXPLORE_DESIGN_INDEX = 9

const STORY_TEXT =
  'We all know public spaces are very important places of encounter and social interactions. Cities that grow organically grow their public spaces alongside their communities. But in this district of Wolfsburg, Westhagen this has been difficult.'

const WESTHAGEN_TEXT = [
  "Westhagen, southwest of Wolfsburg's center, is home to about 9,000 residents. 1960s high-rise housing still defines the district today.",
  "It's one of the cheapest places to live, drawing young families as an arrival zone — but outdated housing pushes residents out quickly, weakening community ties and neglecting public spaces.",
  'Yet it has real potential: a growing district with one of the highest diversities in Wolfsburg, around 64% with a migration background.',
  'Agentic Square proposes co-creating neighbourhood spaces — led by communities, guided by AI.',
]

const SITE_ANALYSIS_TEXT = [
  'Our site of intervention that we chose is the Westhagen Marktplatz, which sits at the heart of this district. It is surrounded by many public spaces like the cultural house, city library, church, youth center, supermarkets and so on all within 5-10 mins of walking distance. However we found out that it is currently underused and mostly empty, which we found was a nice testing ground for our project.',
]

const STORYBOARD_TEXT =
  "Neighbors plan and build their own playground on the Marktplatz, step by step, guided by AI. Brochures break the build into simple stages, while AR lets families preview the design on-site before anything is built. Then it's hands-on — parents and kids sort pallets, stack bricks, and build it together."

const AIM_TEXT =
  "Our project's aim is to empower neighborhoods to create their own public spaces together and turn the current fragmented spaces into community anchored spaces. The components of the project are- an app that contains AI where people can converse in the form of chat, resources such as manuals, plans and brochures\n\nAI provides guidance through webchats, supply of manuals, brochures and technical implementation of the project from creation, mediation to dismantling. Additionally it provides information on materials and construction.\n\nBut the power of creation lies within the people who democratically decide on the outcome."

export default function App() {
  const refs = useRef([])
  const containerRef = useRef(null)
  const setRef = i => el => { refs.current[i] = el }
  const scrollTo = i => refs.current[i]?.scrollIntoView({ behavior: 'smooth' })
  const progress = useScrollContainerProgress()
  const idle = useIdle(IDLE_TIMEOUT_MS)

  // Some browsers try to restore the scroll container's exact scroll
  // position across a reload, which would drop a "restart" back mid-deck
  // instead of at the cover. Force it back to the top on every fresh load.
  useLayoutEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0
  }, [])

  // Attract-mode slideshow — each slide just appears (an instant cut, no
  // visible scrolling motion), dwelling on each before advancing, with a
  // longer dwell on the 3D section for its auto-rotate. Loops back to the
  // cover at the end.
  useEffect(() => {
    if (!idle) return
    let i = 0
    let timer
    const step = () => {
      refs.current[i]?.scrollIntoView({ behavior: 'instant' })
      const dwell = i === EXPLORE_DESIGN_INDEX ? AUTOSCROLL_MODEL_DWELL_MS : AUTOSCROLL_DWELL_MS
      i = (i + 1) % refs.current.length
      timer = setTimeout(step, dwell)
    }
    step()

    return () => {
      clearTimeout(timer)
      // Whoever interrupted the tour is a fresh visitor arriving at the
      // tablet — send them back to a truly fresh cover, same as hitting
      // Restart. A plain scrollTop reset isn't enough: sections like the
      // typewriter slides only ever play their type/fade-in once per
      // mount, so if the tour had already scrolled past them, revisiting
      // later would show the text stuck in its finished state instead of
      // replaying. A full reload resets that state along with everything else.
      window.location.reload()
    }
  }, [idle])

  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <ScrollProgressRail progress={progress} />
      {progress > 0.01 && <RestartButton />}
      <div className="scroll-container" ref={containerRef}>
      <CoverSection innerRef={setRef(0)} onNext={() => scrollTo(1)} onJump={scrollTo} n={1} />

      <IntroSection
        innerRef={setRef(1)} onNext={() => scrollTo(2)} onBack={() => scrollTo(0)} n={2}
      />

      <TypewriterSection
        innerRef={setRef(2)} mode="type" text={STORY_TEXT}
        onNext={() => scrollTo(3)} onBack={() => scrollTo(1)} n={3}
      />

      <ImageSection
        innerRef={setRef(3)} src={`${BASE}images/site/01-overview.webp`} alt="Wolfsburg overview"
        title="Wolfsburg"
        onNext={() => scrollTo(4)} onBack={() => scrollTo(2)} n={4}
      />

      <ImageSection
        innerRef={setRef(4)} src={`${BASE}images/site/02-westhagen.webp`} alt="Westhagen"
        title="Westhagen" text={WESTHAGEN_TEXT} textPosition="right"
        onNext={() => scrollTo(5)} onBack={() => scrollTo(3)} n={5}
      />

      <ImageSection
        innerRef={setRef(5)} src={`${BASE}images/site/site-analysis.webp`} alt="Site analysis"
        title="Marktplatz" text={SITE_ANALYSIS_TEXT} textPosition="right"
        onNext={() => scrollTo(6)} onBack={() => scrollTo(4)} n={6}
      />

      <ImageSection
        innerRef={setRef(6)} src={`${BASE}images/site/current-perspective.webp`} alt="Current perspective"
        title="Current Perspective"
        onNext={() => scrollTo(7)} onBack={() => scrollTo(5)} n={7}
      />

      <TypewriterSection
        innerRef={setRef(7)} mode="fade" text={AIM_TEXT}
        followUp={{
          title: 'Interactive Chat',
          qr: `${BASE}images/qr-agentic-square.png`,
        }}
        onNext={() => scrollTo(8)} onBack={() => scrollTo(6)} n={8}
      />

      <ImageSection
        innerRef={setRef(8)} src={`${BASE}images/manual.png`} alt="Assembly manual"
        title="Manual" fit="contain"
        onNext={() => scrollTo(9)} onBack={() => scrollTo(7)} n={9}
      />

      <ExploreDesignSection
        innerRef={setRef(9)} onNext={() => scrollTo(10)} onBack={() => scrollTo(8)} n={10}
      />

      <StoryboardSection
        innerRef={setRef(10)} text={STORYBOARD_TEXT}
        onNext={() => scrollTo(11)} onBack={() => scrollTo(9)} n={11}
      />

      <ImageSection
        innerRef={setRef(11)} src={`${BASE}images/comparisons/westhagen-plays.webp`} alt="Westhagen Plays"
        eyebrow="Design Scenarios" title="Westhagen Plays" fit="contain"
        onNext={() => scrollTo(12)} onBack={() => scrollTo(10)} n={12}
      />

      <CompareSliderSection
        innerRef={setRef(12)} eyebrow="Design Scenarios" title="Urban Gardening & Wine Fest"
        imageA={`${BASE}images/comparisons/urban-gardening.webp`} labelA="Urban Gardening"
        imageB={`${BASE}images/comparisons/wine-fest.webp`} labelB="Wine Fest"
        onNext={() => scrollTo(13)} onBack={() => scrollTo(11)} n={13}
      />

      <BrochuresSection
        innerRef={setRef(13)} onNext={() => scrollTo(14)} onBack={() => scrollTo(12)} n={14}
      />

      <ExpansionSection
        innerRef={setRef(14)} onRestart={() => window.location.reload()} onBack={() => scrollTo(13)} n={15}
      />
      </div>
    </>
  )
}

import { useRef } from 'react'
import useScrollContainerProgress from './hooks/useScrollContainerProgress'
import useIdle from './hooks/useIdle'
import CustomCursor from './components/CustomCursor'
import GrainOverlay from './components/GrainOverlay'
import ScrollProgressRail from './components/ScrollProgressRail'
import HomeButton from './components/HomeButton'
import Screensaver from './components/Screensaver'
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

const STORY_TEXT =
  'We all know public spaces are very important places of encounter and social interactions. Cities that grow organically grow their public spaces alongside their communities. But in this district of Wolfsburg, Westhagen this has been difficult.'

const WESTHAGEN_TEXT = [
  "Westhagen sits in the southwest of the city center and is home to about 9,000 residents. Wolfsburg's rapid development is particularly evident in this district where high rise housing units developed during 1960s still characterize this district today.",
  'It is one of the cheapest places to live and naturally attracts residents and young families as an arrival zone. However, communities rapidly change as residents leave for better districts as it currently has mostly outdated housing units in need of renovation. Due to this reason the community ties are very weak and public spaces are neglected.',
  'However, it also has many potentials. It is a growing district and has one of the highest diversities in Wolfsburg with around 64 percent residents with a migration background.',
  'Seeing this potential our project Agentic Square proposes co creation of neighbourhood spaces that are led by communities and guided by AI.',
]

const SITE_ANALYSIS_TEXT = [
  'Our site of intervention that we chose is the Westhagen Marktplatz, which sits at the heart of this district. It is surrounded by many public spaces like the cultural house, city library, church, youth center, supermarkets and so on all within 5-10 mins of walking distance. However we found out that it is currently underused and mostly empty, which we found was a nice testing ground for our project.',
]

const STORYBOARD_TEXT =
  'Neighbors come together on the Marktplatz to plan and build their own playground, step by step, guided by AI. Brochures break the build down into simple stages, while AR visualization lets everyone preview the design on-site before anything is built — so families know exactly what they\'re working towards. Then it\'s hands-on: parents and their kids sort pallets, stack bricks and assemble the pieces together, turning a shared afternoon of building into a playground the whole community helped create.'

const AIM_TEXT =
  "Our project's aim is to empower neighborhoods to create their own public spaces together and turn the current fragmented spaces into community anchored spaces. The components of the project are- an app that contains AI where people can converse in the form of chat, resources such as manuals, plans and brochures\n\nAI provides guidance through webchats, supply of manuals, brochures and technical implementation of the project from creation, mediation to dismantling. Additionally it provides information on materials and construction.\n\nBut the power of creation lies within the people who democratically decide on the outcome."

export default function App() {
  const refs = useRef([])
  const setRef = i => el => { refs.current[i] = el }
  const scrollTo = i => refs.current[i]?.scrollIntoView({ behavior: 'smooth' })
  const progress = useScrollContainerProgress()
  const idle = useIdle(IDLE_TIMEOUT_MS)

  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <ScrollProgressRail progress={progress} />
      {progress > 0.01 && <HomeButton onClick={() => scrollTo(0)} />}
      {idle && <Screensaver />}
      <div className="scroll-container">
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

      <ExploreDesignSection
        innerRef={setRef(8)} onNext={() => scrollTo(9)} onBack={() => scrollTo(7)} n={9}
      />

      <StoryboardSection
        innerRef={setRef(9)} text={STORYBOARD_TEXT}
        onNext={() => scrollTo(10)} onBack={() => scrollTo(8)} n={10}
      />

      <ImageSection
        innerRef={setRef(10)} src={`${BASE}images/comparisons/westhagen-plays.webp`} alt="Westhagen Plays"
        eyebrow="Design Scenarios" title="Westhagen Plays" fit="contain"
        onNext={() => scrollTo(11)} onBack={() => scrollTo(9)} n={11}
      />

      <CompareSliderSection
        innerRef={setRef(11)} eyebrow="Design Scenarios" title="Urban Gardening & Wine Fest"
        imageA={`${BASE}images/comparisons/urban-gardening.webp`} labelA="Urban Gardening"
        imageB={`${BASE}images/comparisons/wine-fest.webp`} labelB="Wine Fest"
        onNext={() => scrollTo(12)} onBack={() => scrollTo(10)} n={12}
      />

      <BrochuresSection
        innerRef={setRef(12)} onNext={() => scrollTo(13)} onBack={() => scrollTo(11)} n={13}
      />

      <ExpansionSection
        innerRef={setRef(13)} onRestart={() => scrollTo(0)} onBack={() => scrollTo(12)} n={14}
      />
      </div>
    </>
  )
}

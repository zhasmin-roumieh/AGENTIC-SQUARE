import { useState, useCallback } from 'react'
import HomeScreen    from './components/HomeScreen'
import IntroScreen   from './components/IntroScreen'
import ExploreScreen from './components/ExploreScreen'
import NextScreen    from './components/NextScreen'
import DetailScreen  from './components/DetailScreen'

export default function App() {
  const [screen,   setScreen]   = useState('home')
  const [selected, setSelected] = useState(null)

  const goIntro   = useCallback(() => setScreen('intro'),   [])
  const goExplore = useCallback(() => setScreen('explore'), [])
  const goNext    = useCallback(() => setScreen('next'),    [])
  const goDetail  = useCallback((label) => { setSelected(label); setScreen('detail') }, [])
  const goBack    = useCallback(() => setScreen('next'),    [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#fff' }}>
      <HomeScreen    active={screen === 'home'}    onEnter={goIntro}           />
      <IntroScreen   active={screen === 'intro'}   onExplore={goExplore}       />
      <ExploreScreen active={screen === 'explore'} onNext={goNext}             />
      <NextScreen    active={screen === 'next'}    onSelect={goDetail}         />
      <DetailScreen  active={screen === 'detail'}  selected={selected} onBack={goBack} />
    </div>
  )
}

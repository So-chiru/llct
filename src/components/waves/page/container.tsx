import WavesComponent from './component'

import { checkSystemDark } from '@/utils/darkmode'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const Waves = () => {
  const darkTheme = useSelector(
    (state: RootState) => state.settings.useDarkMode.value
  ) as boolean

  const useSystemMatchDarkMode = useSelector(
    (state: RootState) => state.settings.matchSystemAppearance.value
  ) as boolean

  const dark = checkSystemDark(darkTheme, useSystemMatchDarkMode)
  const showPlayer = useSelector((state: RootState) => state.ui.player.show)

  return (
    <>
      <WavesComponent dark={dark} show={!showPlayer}></WavesComponent>
    </>
  )
}

export default Waves

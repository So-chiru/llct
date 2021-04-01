import { RootState } from '@/store'
import { useSelector } from 'react-redux'

import PlayerButtonComponent from './component'

const PlayerButtonContainer = () => {
  const playing = useSelector((state: RootState) => state.playing)

  // TODO : pass what is playing to PlayerButtonComponent

  return <PlayerButtonComponent></PlayerButtonComponent>
}

export default PlayerButtonContainer

import { RootState } from '@/store'
import { showPlayer } from '@/store/ui/actions'
import { useDispatch, useSelector } from 'react-redux'

import PlayerComponent from './component'

const PlayerContainer = () => {
  const dispatch = useDispatch()

  const playing = useSelector((state: RootState) => state.playing)
  const show = useSelector((state: RootState) => state.ui.player.show)

  const closePlayer = () => {
    dispatch(showPlayer(false))
  }

  return <PlayerComponent show={show} clickOut={closePlayer}></PlayerComponent>
}

export default PlayerContainer

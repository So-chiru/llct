import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'

import PlayerButtonComponent from './component'

import { MusicPlayerState } from '@/@types/state'
import { showPlayer } from '@/store/actions/ui'

const PlayerButtonContainer = () => {
  const dispatch = useDispatch()

  const playing = useSelector((state: RootState) => state.playing)
  const show = useSelector((state: RootState) => state.ui.player.show)

  // TODO : pass what is playing to PlayerButtonComponent

  // TODO : change hardcoded music argument to playing data

  console.log(show)

  const clickHandler = () => {
    dispatch(showPlayer(true))
  }

  return (
    <PlayerButtonComponent
      show={!show}
      music={{
        title: 'testMusic',
        artist: '아티스트',
        image: `https://picsum.photos/seed/${Math.random() * 10000}/200`
      }}
      state={MusicPlayerState.Playing}
      onClick={clickHandler}
    ></PlayerButtonComponent>
  )
}

export default PlayerButtonContainer

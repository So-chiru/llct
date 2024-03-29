import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'

import PlayerButtonComponent from './component'
import PlayerAlbumCoverAnimationComponent from './animation-component'

import * as ui from '@/store/ui/actions'

const PlayerButton = () => {
  const dispatch = useDispatch()

  const playing = useSelector((state: RootState) => state.playing)
  const showPlayer = useSelector((state: RootState) => state.ui.player.show)
  const color = useSelector((state: RootState) => state.playing.color)

  const clickHandler = () => {
    dispatch(ui.showPlayer(true))
  }

  const progressListener = () => {
    return playing.instance!.progress
  }

  return (
    <>
      <PlayerAlbumCoverAnimationComponent></PlayerAlbumCoverAnimationComponent>
      <PlayerButtonComponent
        show={!showPlayer}
        music={
          playing.mode === 'queue'
            ? playing.queue[playing.pointer]
            : playing.playlist!.items[playing.playlistPointer]
        }
        color={color || undefined}
        progress={progressListener}
        state={playing.state.player}
        onClick={clickHandler}
      ></PlayerButtonComponent>
    </>
  )
}

export default PlayerButton

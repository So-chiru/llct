import { RootState } from '@/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PlayerButtonComponent from './component'

import { MusicPlayerState } from '@/@types/state'
import { showPlayer } from '@/store/ui/actions'

const PlayerButtonContainer = () => {
  const dispatch = useDispatch()

  const playing = useSelector((state: RootState) => state.playing)
  const show = useSelector((state: RootState) => state.ui.player.show)

  const [amf, setAmf] = useState<number>()
  const [listenerProgress, setListenerProgress] = useState<number>()

  const clickHandler = () => {
    dispatch(showPlayer(true))
  }

  if (playing.state.player === MusicPlayerState.Playing && !show && !amf) {
    const update = () => {
      setListenerProgress(playing.instance?.progress)
      setAmf((setTimeout(update, 100) as unknown) as number)
    }

    update()
  } else if (
    (playing.state.player !== MusicPlayerState.Playing || show) &&
    amf
  ) {
    clearTimeout(amf)
    setAmf(0)
  }

  return (
    <PlayerButtonComponent
      show={!show}
      music={playing.queue[playing.pointer]}
      progress={listenerProgress || playing.instance?.progress || 0}
      state={playing.state.player}
      onClick={clickHandler}
    ></PlayerButtonComponent>
  )
}

export default PlayerButtonContainer

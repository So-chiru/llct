import { useEffect, useState } from 'react'
import { RootState } from '@/store'
import { showPlayer } from '@/store/ui/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import PlayerComponent from './component'
import { playNow } from '@/store/player/actions'
import { searchById } from '@/utils/songs'

interface PlayerRouterState {
  closePlayer?: boolean
  id?: string
}

const PlayerContainer = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [initial, setIntitial] = useState<boolean>(true)
  const [dataInitial, setDataIntitial] = useState<boolean>(true)

  const playing = useSelector((state: RootState) => state.playing)
  const show = useSelector((state: RootState) => state.ui.player.show)
  const data = useSelector((state: RootState) => state.songs)

  if (initial) {
    history.listen(listener => {
      if (
        listener.pathname.indexOf('/play') === -1 ||
        (listener.state === 'object' &&
          (listener.state as PlayerRouterState).closePlayer)
      ) {
        dispatch(showPlayer(false))
      }

      // TODO : 플레이어에서 실행
    })

    setIntitial(false)
  }

  if (dataInitial && data.items) {
    if (history.location.pathname.indexOf('/play/') > -1) {
      const split = history.location.pathname.split('/')

      let id = split[split.length - 1]

      if (
        history.location.state &&
        (history.location.state as PlayerRouterState).id
      ) {
        id =
          (history.location.state as PlayerRouterState).id ||
          split[split.length - 1]
      }

      requestAnimationFrame(() => {
        if (data.items) {
          dispatch(playNow(searchById(id, data.items)))
        }
      })
    }

    setDataIntitial(false)
  }

  const closePlayer = () => {
    dispatch(showPlayer(false))
  }

  return (
    <PlayerComponent
      music={playing.queue[playing.pointer]}
      playState={playing.state.player}
      show={show}
      clickOut={closePlayer}
    ></PlayerComponent>
  )
}

export default PlayerContainer

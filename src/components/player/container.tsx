import { useState } from 'react'
import { RootState } from '@/store'
import { showPlayer } from '@/store/ui/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { MusicPlayerState } from '@/@types/state'

import PlayerComponent from './component'
import { playNow, setPlayState } from '@/store/player/actions'
import { searchById } from '@/utils/songs'
import LLCTNativeAudio from '@/core/audio_stack/native'

interface PlayerRouterState {
  closePlayer?: boolean
  id?: string
}

const toggleScrollbar = (on: boolean) => {
  document.documentElement.style.overflow = on ? 'unset' : 'hidden'
}

const PlayerContainer = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [initial, setIntitial] = useState<boolean>(true)
  const [dataInitial, setDataIntitial] = useState<boolean>(true)

  const [playerInstance, setPlayerInstance] = useState<LLCTAudioStack>()

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

  if (!playerInstance) {
    // TODO : 오디오 스택을 설정에서 지정할 수 있게 하기
    const instance = new LLCTNativeAudio()

    // FIXME : 고정 URL
    instance.load('http://api-local.lovelivec.kr/audio/11')

    setPlayerInstance(instance)
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

  toggleScrollbar(!show)

  // 플레이어 컨트롤러 지정. 여기서 UI 동작을 수행했을 때 동작할 액션을 정의합니다.
  const controller: PlayerController = {
    play: () => {
      playerInstance?.play()
      dispatch(setPlayState(MusicPlayerState.Playing))
    },
    pause: () => {
      playerInstance?.pause()
      dispatch(setPlayState(MusicPlayerState.Paused))
    },
    progress: () => {
      return playerInstance?.progress || 0
    },
    seek: (seekTo: number) => {
      if (!playerInstance) {
        return
      }

      playerInstance.progress = seekTo
    }
  }

  return (
    <PlayerComponent
      music={playing.queue[playing.pointer]}
      state={{
        playState: playing.state.player,
        progress: playerInstance?.progress
      }}
      show={show}
      controller={controller}
      clickOut={closePlayer}
    ></PlayerComponent>
  )
}

export default PlayerContainer

import { useState } from 'react'
import { RootState } from '@/store'
import { showPlayer } from '@/store/ui/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { MusicPlayerState } from '@/@types/state'

import PlayerComponent from './component'
import { playNow, setPlayState, setInstance } from '@/store/player/actions'
import { searchById, audioURL } from '@/utils/songs'
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

  if (!playing.instance) {
    // TODO : 오디오 스택을 설정에서 지정할 수 있게 하기
    const instance = new LLCTNativeAudio()

    if (playing.pointer && playing.queue[playing.pointer]) {
      instance.load(audioURL(playing.queue[playing.pointer].id))
    }

    instance.events.on('play', () => {
      dispatch(setPlayState(MusicPlayerState.Playing))
    })

    instance.events.on('pause', () => {
      dispatch(setPlayState(MusicPlayerState.Paused))
    })

    instance.events.on('end', () => {
      // TODO : 플레이어 끝났을 경우 반복 재생 처리
      dispatch(setPlayState(MusicPlayerState.Stopped))
    })

    dispatch(setInstance(instance))
  } else if (
    playing.instance.src !== audioURL(playing.queue[playing.pointer]?.id || '')
  ) {
    playing.instance.load(audioURL(playing.queue[playing.pointer]?.id || ''))
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
      playing.instance?.play()
      dispatch(setPlayState(MusicPlayerState.Playing))
    },
    pause: () => {
      playing.instance?.pause()
      dispatch(setPlayState(MusicPlayerState.Paused))
    },
    progress: () => {
      return playing.instance?.progress || 0
    },
    seek: (seekTo: number) => {
      if (!playing.instance) {
        return
      }

      playing.instance.progress = seekTo
    }
  }

  return (
    <PlayerComponent
      music={playing.queue[playing.pointer]}
      state={{
        playState: playing.state.player,
        progress: playing.instance?.progress,
        duration: playing.instance?.duration
      }}
      show={show}
      controller={controller}
      clickOut={closePlayer}
    ></PlayerComponent>
  )
}

export default PlayerContainer

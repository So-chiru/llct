import { useEffect, useState } from 'react'
import { RootState } from '@/store'
import { showPlayer } from '@/store/ui/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { MusicPlayerState, PlayerLoadState } from '@/@types/state'

import PlayerComponent from './component'
import {
  play,
  skip,
  setPlayState,
  setLoadState,
  setInstance
} from '@/store/player/actions'
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
  const [eqVisible, setEQVisible] = useState<boolean>(false)

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
      // TODO : 재생이 끝났을 경우 다음 곡 재생하거나 반복하는 이벤트 처리
      // 현재는 playing이 기본 state에서 안바뀜

      // if (
      //   playing.pointer !== -1 &&
      //   playing.pointer < playing.queue.length - 1
      // ) {
      //   dispatch(play(null, ++playing.pointer))

      //   return
      // }

      dispatch(setPlayState(MusicPlayerState.Stopped))
    })

    instance.events.on('metadata', () => {
      dispatch(setLoadState(PlayerLoadState.LoadedMetadata))
    })

    instance.events.on('load', () => {
      dispatch(setLoadState(PlayerLoadState.Done))
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
          dispatch(play(searchById(id, data.items)))
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
    },

    prev: () => {
      dispatch(skip(-1))

      requestAnimationFrame(() => {
        if (playing.state.player === MusicPlayerState.Playing) {
          playing.instance!.play()
        }
      })
    },

    next: () => {
      dispatch(skip(1))

      requestAnimationFrame(() => {
        if (playing.state.player === MusicPlayerState.Playing) {
          playing.instance!.play()
        }
      })
    },

    toggleEQ: () => {
      setEQVisible(!eqVisible)
    }
  }

  return (
    <PlayerComponent
      music={playing.queue[playing.pointer]}
      state={{
        playState: playing.state.player,
        loadState: playing.state.load,
        progress: playing.instance?.progress,
        duration: playing.instance?.duration,
        supportEffects: playing.instance?.supportEffects
      }}
      show={show}
      showEQ={eqVisible}
      controller={controller}
      clickOut={closePlayer}
    ></PlayerComponent>
  )
}

export default PlayerContainer

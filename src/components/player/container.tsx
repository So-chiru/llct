import { useEffect, useState } from 'react'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { MusicPlayerState } from '@/@types/state'

import PlayerComponent from './component'
import { play, skip, setPlayState } from '@/store/player/actions'
import { searchById, audioURL } from '@/utils/songs'

interface PlayerRouterState {
  closePlayer?: boolean
  id?: string
}

const PlayerContainer = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [eqVisible, setEQVisible] = useState<boolean>(false)
  const [lastSeek, setLastSeek] = useState<number>(0)

  const playing = useSelector((state: RootState) => state.playing)
  const songs = useSelector((state: RootState) => state.songs.items)

  useEffect(() => {
    if (!songs) {
      return
    }

    // 플레이어가 최초로 로딩되었고, URL에 /play/ 가 있는 경우
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
        dispatch(play(searchById(id, songs as LLCTSongDataV2)))
      })
    }
  }, [songs])

  if (
    playing.pointer !== -1 &&
    playing.instance &&
    playing.instance.src !== audioURL(playing.queue[playing.pointer]?.id)
  ) {
    playing.instance.load(audioURL(playing.queue[playing.pointer]?.id))
  }

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
    seek: (seekTo: number) => {
      if (!playing.instance) {
        return
      }

      playing.instance.progress = seekTo
      setLastSeek(Date.now())
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
      instance={playing.instance}
      state={{
        playState: playing.state.player,
        loadState: playing.state.load,
        lastSeek
      }}
      showEQ={eqVisible}
      controller={controller}
    ></PlayerComponent>
  )
}

export default PlayerContainer

import LLCTNativeAudio from '@/core/audio_stack/native'
import { RootState } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import * as player from '@/store/player/actions'
import { MusicPlayerState, PlayerLoadState } from '@/@types/state'
import LLCTAdvancedAudio from '@/core/audio_stack/advanced'

const PlayerInstanceContainer = () => {
  const dispatch = useDispatch()
  const instance = useSelector((state: RootState) => state.playing.instance)
  const audioStack = useSelector(
    (state: RootState) => state.settings.audioStack.value
  )

  useEffect(() => {
    if (!instance) {
      const instance =
        audioStack === 'native'
          ? new LLCTNativeAudio()
          : new LLCTAdvancedAudio()

      // history.listen(listener => {
      //   if (
      //     listener.pathname.indexOf('/play') === -1 ||
      //     (listener.state === 'object' &&
      //       (listener.state as PlayerRouterState).closePlayer)
      //   ) {
      //     closePlayer()
      //   }

      //   // TODO : 플레이어에서 실행
      // })

      instance.events.on('play', () =>
        dispatch(player.setPlayState(MusicPlayerState.Playing))
      )

      instance.events.on('pause', () =>
        dispatch(player.setPlayState(MusicPlayerState.Paused))
      )

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

        dispatch(player.setPlayState(MusicPlayerState.Stopped))
      })

      instance.events.on('metadata', () => {
        dispatch(player.setLoadState(PlayerLoadState.LoadedMetadata))
      })

      instance.events.on('load', () => {
        dispatch(player.setLoadState(PlayerLoadState.Done))
      })

      instance.events.on('requestPreviousTrack', () => {
        dispatch(player.skip(-1))

        requestAnimationFrame(() => {
          instance.play()
        })
      })

      instance.events.on('requestNextTrack', () => {
        dispatch(player.skip(1))

        requestAnimationFrame(() => {
          instance.play()
        })
      })

      dispatch(player.setInstance(instance))
    }
  }, [instance])

  useEffect(() => {
    if (instance && instance.type !== audioStack) {
      instance.stop()

      let inst

      if (audioStack === 'native') {
        inst = new LLCTNativeAudio()
      } else if (audioStack === 'advanced') {
        inst = new LLCTAdvancedAudio()
      } else {
        throw new Error('??? why audioStack is not defined??????')
      }

      dispatch(player.setInstance(inst))
    }
  }, [audioStack])

  const playing = useSelector((state: RootState) => state.playing)

  useEffect(() => {
    if (!instance || !instance.updateMetadata) {
      return
    }

    const play = playing.queue[playing.pointer]

    if (!play) {
      return
    }

    instance.updateMetadata(play.title, play.artist as string, play.image)
  }, [instance, playing.pointer])

  return null
}

export default PlayerInstanceContainer

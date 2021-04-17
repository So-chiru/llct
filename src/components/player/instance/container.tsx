import LLCTNativeAudio from '@/core/audio_stack/native'
import { RootState } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import * as player from '@/store/player/actions'
import { MusicPlayerState, PlayerLoadState } from '@/@types/state'

const PlayerInstanceContainer = () => {
  const dispatch = useDispatch()
  const instance = useSelector((state: RootState) => state.playing.instance)

  useEffect(() => {
    if (!instance) {
      const instance = new LLCTNativeAudio()

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

      dispatch(player.setInstance(instance))
    }
  }, [instance])

  return null
}

export default PlayerInstanceContainer

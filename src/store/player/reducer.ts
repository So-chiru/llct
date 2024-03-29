import { LLCTAudioStack } from '@/@types/audio'
import { MusicPlayerState, PlayerLoadState } from '@/@types/state'
import eventBus from '@/core/eventbus'
import { PlayerRootEvents } from './events'

export interface PlayerState {
  player: MusicPlayerState
  load: PlayerLoadState
}

interface PlayerRootData {
  pointer: number
  queue: MusicMetadataWithID[]
  mode: 'queue' | 'playlist'
  playlistPointer: number
  playlist: MusicPlaylist | null
  instance?: LLCTAudioStack
  events: eventBus<PlayerRootEvents>
  color: LLCTColorV2 | null
  state: PlayerState
  audioAvailable: boolean
}

const PlayerDefault: PlayerRootData = {
  pointer: -1,
  queue: [],
  mode: 'queue',
  playlistPointer: -1,
  playlist: null,
  events: new eventBus<PlayerRootEvents>(),
  color: null,
  state: {
    player: MusicPlayerState.Stopped,
    load: PlayerLoadState.NotLoaded,
  },
  audioAvailable: process.env.NO_AUDIO_MODE !== 'true',
}

const MAX_QUEUE_SIZE = 100

const structQueue = (state = PlayerDefault, action: PlayerReducerAction) => {
  const object: Pick<PlayerRootData, 'queue' | 'pointer' | 'mode'> = {
    mode: 'queue',
    queue: state.queue,
    pointer: state.pointer,
  }

  // 정해진 크기 보다 큐가 크면 큐 앞 부분을 자름
  if (object.queue.length >= MAX_QUEUE_SIZE) {
    object.queue = object.queue.slice(-MAX_QUEUE_SIZE + 1)
  }

  // 큐에 항목이 있고 마지막 항목이 현재 추가하려는 항목의 ID가 아닐 경우
  const lastIsSame =
    state.queue.length &&
    state.queue[state.queue.length - 1].id ===
      ((action.data || {}) as MusicMetadataWithID).id

  if (action.data && !lastIsSame) {
    object.queue = [...object.queue, action.data] as MusicMetadataWithID[]
  }

  if (typeof action.skip !== 'undefined') {
    object.pointer = Math.min(
      object.queue.length - 1,
      Math.max(0, object.pointer + action.skip)
    )
  } else {
    object.pointer = action.pointer ?? object.queue.length - 1
  }

  return object
}

const structPlaylistQueue = (
  state = PlayerDefault,
  action: PlayerReducerAction
) => {
  const object: Pick<
    PlayerRootData,
    'playlist' | 'playlistPointer' | 'mode'
  > = {
    mode: 'playlist',
    playlist: state.playlist,
    playlistPointer: state.playlistPointer,
  }

  if (action.data) {
    object.playlist = action.data as MusicPlaylist
  }

  if (!object.playlist) {
    return object
  }

  const skip = action.skip || 0
  if (skip) {
    object.playlistPointer = Math.min(
      object.playlist.items.length - 1,
      Math.max(0, object.playlistPointer + skip)
    )
  } else {
    object.playlistPointer = action.pointer ?? 0
  }

  return object
}

const PlayerReducer = (
  state = PlayerDefault,
  action: PlayerReducerAction
): typeof PlayerDefault => {
  switch (action.type) {
    case '@llct/player/addToQueue':
      return Object.assign({}, state, {
        queue: [...state.queue, action.data],
      })
    case '@llct/player/setAudioAvailable':
      return Object.assign({}, state, {
        audioAvailable: action.data,
      })
    case '@llct/player/play':
      return Object.assign({}, state, structQueue(state, action))
    case '@llct/player/playPlaylist':
      return Object.assign({}, state, structPlaylistQueue(state, action))
    case '@llct/player/both':
      return Object.assign(
        {},
        state,
        state.mode === 'queue'
          ? structQueue(state, action)
          : structPlaylistQueue(state, action)
      )
    case '@llct/player/setInstance':
      return Object.assign({}, state, {
        instance: action.data,
      })
    case '@llct/player/setColor':
      return Object.assign({}, state, {
        color: action.data,
      })
    case '@llct/player/setState':
      return (() => {
        const data = Object.assign({}, state, {
          state: {
            ...state.state,
            player: action.data,
          },
        })

        state.events.runAll('onStateChange', data.state)

        return data
      })()
    case '@llct/player/setLoadState':
      return Object.assign({}, state, {
        state: {
          ...state.state,
          load: action.data,
        },
      })
    default:
      return state
  }
}

export default PlayerReducer

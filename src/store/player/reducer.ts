import { MusicPlayerState, PlayerLoadState } from '@/@types/state'

interface PlayerRootData {
  pointer: number
  queue: MusicMetadataWithID[]
  instance?: LLCTAudioStack
  state: {
    player: MusicPlayerState
    load: PlayerLoadState
  }
}

const PlayerDefault: PlayerRootData = {
  pointer: -1,
  queue: [],
  state: {
    player: MusicPlayerState.Stopped,
    load: PlayerLoadState.NotLoaded
  }
}

const MAX_QUEUE_SIZE = 100

const structPlayQueue = (
  state = PlayerDefault,
  action: PlayerReducerAction
) => {
  const object = {
    queue: state.queue,
    pointer: state.pointer
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

  if (typeof action.pointer !== 'undefined') {
    object.pointer = action.pointer
  } else {
    object.pointer = object.queue.length - 1
  }

  if (typeof action.skip !== 'undefined') {
    object.pointer = Math.min(
      object.queue.length - 1,
      Math.max(0, object.pointer + action.skip)
    )
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
        queue: [...state.queue, action.data]
      })
    case '@llct/player/play':
      return Object.assign({}, state, structPlayQueue(state, action))
    case '@llct/player/setInstance':
      return Object.assign({}, state, {
        instance: action.data
      })
    case '@llct/player/setState':
      return Object.assign({}, state, {
        state: {
          ...state.state,
          player: action.data
        }
      })
    case '@llct/player/setLoadState':
      return Object.assign({}, state, {
        state: {
          ...state.state,
          load: action.data
        }
      })
    default:
      return state
  }
}

export default PlayerReducer

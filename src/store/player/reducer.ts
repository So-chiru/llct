import { MusicPlayerState, PlayerLoadState } from '@/@types/state'

interface PlayerRootData {
  pointer: number
  queue: MusicMetadata[]
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
    load: PlayerLoadState.Empty
  }
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
    case '@llct/player/playNow':
      return Object.assign({}, state, {
        queue: [...state.queue, action.data],
        pointer: state.queue.length
      })
    case '@llct/player/play':
      return Object.assign({}, state, {
        pointer:
          typeof action.pointer !== 'undefined' ? action.pointer : state.queue
      })
    case '@llct/player/setState':
      return Object.assign({}, state, {
        state: {
          ...state.state,
          player: action.data
        }
      })
    case '@llct/player/add_queue':
      return Object.assign({}, state, {
        queue: [...state.queue].concat(action.data as MusicMetadata)
      })
    default:
      return state
  }
}

export default PlayerReducer

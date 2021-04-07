import { MusicPlayerState, PlayerLoadState } from '@/@types/state'

interface PlayingRootData {
  pointer: number
  queue: MusicMetadata[]
  state: {
    player: MusicPlayerState
    load: PlayerLoadState
  }
}

const PlayingDefault: PlayingRootData = {
  pointer: -1,
  queue: [],
  state: {
    player: MusicPlayerState.Stopped,
    load: PlayerLoadState.Empty
  }
}
interface PlayingReducerAction {
  id: string
  type: string
  data?: unknown
  pointer?: number
  error?: unknown
}

const PlayingReducer = (
  state = PlayingDefault,
  action: PlayingReducerAction
): typeof PlayingDefault => {
  switch (action.type) {
    case '@llct/player/play':
      return Object.assign({}, state, {
        pointer:
          typeof action.pointer !== 'undefined' ? action.pointer : state.queue
      })
    case '@llct/player/add_queue':
      return Object.assign({}, state, {
        queue: [...state.queue].concat(action.data as MusicMetadata)
      })
    default:
      return state
  }
}

export default PlayingReducer

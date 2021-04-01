const PlayingDefault = {
  load: false,
  items: {}
}

interface PlayingReducerAction {
  id: string
  type: string
  data?: Record<string, unknown>
  error?: unknown
}

const PlayingReducer = (
  state = PlayingDefault,
  action: PlayingReducerAction
): typeof PlayingDefault => {
  switch (action.type) {
    // TODO : write case "@llct/player/play", etc.
    default:
      return state
  }
}

export default PlayingReducer

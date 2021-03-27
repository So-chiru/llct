const SongsDefault = {
  load: false,
  items: {}
}

interface SongsReducerAction {
  id: string
  type: string
  data?: Record<string, unknown>
  error?: unknown
}

const SongsReducer = (
  state = SongsDefault,
  action: SongsReducerAction
): typeof SongsDefault => {
  switch (action.type) {
    case 'LLCT_DATA_FETCH_REQUEST':
      return Object.assign({}, state, {
        load: true
      })
    case 'LLCT_DATA_FETCH_SUCCEED':
      return Object.assign({}, state, {
        load: true,
        items: action.data
      })
    case 'LLCT_DATA_FETCH_FAILED':
      return Object.assign({}, state, {
        load: true,
        error: action.error
      })
    default:
      return state
  }
}

export default SongsReducer

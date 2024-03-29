interface CallTypes {
  load: boolean
  id?: string
  data: null | LLCTCall
  error?: string
}

const CallDefault: CallTypes = {
  load: false,
  data: null
}

interface CallReducerAction {
  id: string
  type: string
  data?: Record<string, unknown>
  error?: unknown
}

const SongsReducer = (
  state = CallDefault,
  action: CallReducerAction
): CallTypes => {
  switch (action.type) {
    case '@llct/api_call/request':
      return Object.assign({}, state, {
        load: false,
        id: action.id,
        data: null
      })
    case '@llct/api_call/success':
      return Object.assign({}, state, {
        load: true,
        data: action.data
      })
    case '@llct/api_call/failed':
      return Object.assign({}, state, {
        load: true,
        error: action.error,
        data: null
      })
    default:
      return state
  }
}

export default SongsReducer

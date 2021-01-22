const LLCTDefault = {
  load: false,
  items: []
}

interface LLCTReducerAction {
  id: string
  type: string
  data?: Record<string, unknown>
  error?: unknown

  // FIXME : unknown
}

// type Action = ReturnType<typeof actionName>

const LLCTReducer = (
  state = LLCTDefault,
  action: LLCTReducerAction
): typeof LLCTDefault => {
  if (action.id !== 'MUSIC') {
    return state
  }

  switch (action.type) {
    // case 'FETCH_ONGOING':
    //   return Object.assign({}, state, {
    //     load: true
    //   })
    // case 'FETCH_SUCCESS':
    //   return Object.assign({}, state, {
    //     load: true,
    //     items: action.data
    //   })
    // case 'FETCH_FAILED':
    //   return Object.assign({}, state, {
    //     load: true,
    //     error: action.error
    //   })
    default:
      return state
  }
}

export default LLCTReducer

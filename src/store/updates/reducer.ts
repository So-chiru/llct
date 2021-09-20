interface UpdatesType {
  load: boolean
  data: LLCTUpdate | null
  error: Error | null
}

const UpdatesDefault: UpdatesType = {
  load: false,
  data: null,
  error: null,
  
}

const UpdatesReducer = (
  state = UpdatesDefault,
  action: UpdatesReducerAction
): typeof UpdatesDefault => {
  switch (action.type) {
    case '@llct/updates/request':
      return Object.assign({}, state, {
        load: true,
      })
    case '@llct/updates/success':
      return Object.assign({}, state, {
        load: true,
        data: action.data,
      })
    case '@llct/updates/failed':
      return Object.assign({}, state, {
        load: true,
        error: action.error,
      })
    default:
      return state
  }
}

export default UpdatesReducer

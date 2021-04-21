import store from '@/core/store'

interface RecentTypes {
  played: string[]
  error?: Error
}

const RecentDefault: RecentTypes = {
  played: store.get('recentPlayed', []) as string[]
}

interface RecentReducerAction {
  id?: string
  type: string
  error?: unknown
}

const MAX_PLAYED_SIZE = 30

const recentPlayedStructure = (
  state: RecentTypes,
  action: RecentReducerAction
) => {
  if (!action.id) {
    return state
  }

  if (action.id === state.played[0]) {
    return state
  }

  state.played.unshift(action.id)

  if (state.played.length >= MAX_PLAYED_SIZE) {
    state.played = state.played.slice(0, MAX_PLAYED_SIZE)
  }

  store.set('recentPlayed', state.played)

  return Object.assign({}, state, {
    played: state.played
  })
}

const RecentsReducer = (
  state = RecentDefault,
  action: RecentReducerAction
): RecentTypes => {
  switch (action.type) {
    case '@llct/recents/addPlayed':
      return recentPlayedStructure(state, action)
    default:
      return state
  }
}

export default RecentsReducer

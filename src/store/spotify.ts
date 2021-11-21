import SpotifySessionManager from '@/core/integration/spotify'

export type SpotifyReducerAction = {
  type: string
}

export const enum SpotifySelectionMode {
  Default,
  AddPlaylist,
}

interface SpotifyTypes {
  error?: string
  session: SpotifySessionManager
  use: boolean
}

const sessionManager = new SpotifySessionManager()
const SpotifyDefault: SpotifyTypes = {
  session: sessionManager,
  use: sessionManager.connected,
}

const SpotifyReducer = (
  state = SpotifyDefault,
  action: SpotifyReducerAction
): SpotifyTypes => {
  switch (action.type) {
    case '@llct/spotify/connect':
      return (() => {
        state.session.connect()

        return Object.assign({}, state, {
          use: true,
        })
      })()
    case '@llct/spotify/disconnect':
      return (() => {
        state.session.disconnect()

        return Object.assign({}, state, {
          use: false,
        })
      })()
    default:
      return state
  }
}

export default SpotifyReducer

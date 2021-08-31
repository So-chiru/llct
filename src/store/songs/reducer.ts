import { SongsReducerAction } from './actions'

export const enum SongsSelectionMode {
  Default,
  AddPlaylist
}

interface SongsTypes {
  load: boolean
  items: null | LLCTSongDataV2
  error?: string
  selectionMode: SongsSelectionMode
  selectedItems: string[]
}

const SongsDefault: SongsTypes = {
  load: false,
  items: null,
  selectionMode: SongsSelectionMode.Default,
  selectedItems: []
}

const SongsReducer = (
  state = SongsDefault,
  action: SongsReducerAction
): SongsTypes => {
  switch (action.type) {
    case '@llct/songs/setSelectionMode':
      return Object.assign({}, state, {
        selectionMode: action.data
      })
    case '@llct/songs/addSelectedItems':
      return Object.assign({}, state, {
        selectedItems: [...state.selectedItems, ...(action.data as string[])]
      })
    case '@llct/songs/removeSelectedItems':
      return (() => {
        const items = state.selectedItems

        for (let z = 0; z < (action.data as string[]).length; z++) {
          for (let i = 0; i < items.length; i++) {
            if (items[i] === (action.data as string[])[z]) {
              items.splice(i, 1)
              i--
              break
            }
          }
        }

        return Object.assign({}, state, {
          selectedItems: items
        })
      })()
    case '@llct/songs/clearSelectedItems':
      return Object.assign({}, state, {
        selectedItems: []
      })
    case '@llct/api_lists/request':
      return Object.assign({}, state, {
        load: true
      })
    case '@llct/api_lists/success':
      return Object.assign({}, state, {
        load: true,
        items: action.data
      })
    case '@llct/api_lists/failed':
      return Object.assign({}, state, {
        load: true,
        error: action.error
      })
    default:
      return state
  }
}

export default SongsReducer

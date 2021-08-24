import { SongsSelectionMode } from './reducer'

export interface SongsReducerAction {
  type: string
  data?: unknown
  error?: unknown
}

/**
 * 모든 곡 탭의 노래 선택 모드를 바꿉니다.
 */
export const setSelectionMode = (
  mode: SongsSelectionMode
): SongsReducerAction => {
  return {
    type: '@llct/songs/setSelectionMode',
    data: mode
  }
}

/**
 * 선택한 곡 목록에 곡을 추가합니다.
 */
export const addSelectedItems = (
  item: string | string[]
): SongsReducerAction => {
  return {
    type: '@llct/songs/addSelectedItems',
    data: Array.isArray(item) ? item : [item]
  }
}

/**
 * 선택한 곡 목록에서 곡을 제거합니다.
 */
export const removeSelectedItems = (
  item: string | string[]
): SongsReducerAction => {
  return {
    type: '@llct/songs/removeSelectedItems',
    data: Array.isArray(item) ? item : [item]
  }
}

export const clearSelectedItems = () => {
  return {
    type: '@llct/songs/clearSelectedItems'
  }
}

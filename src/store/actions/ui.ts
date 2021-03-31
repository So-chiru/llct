interface UIReducerAction {
  type: string
  data: unknown
}

/**
 * 테마를 업데이트합니다.
 * @param useDarkMode 다크모드 사용 여부
 */
export const updateTheme = (useDarkMode: boolean): UIReducerAction => {
  return {
    type: 'UPDATE_THEME',
    data: useDarkMode
  }
}

/**
 * 현재 탭을 변경합니다.
 */
export const updateTab = (tabNumber: number): UIReducerAction => {
  return {
    type: 'UPDATE_TAB',
    data: tabNumber
  }
}

const Tabs: LLCTTab[] = [
  {
    name: '대시보드',
    page: 'dashboard'
  },
  {
    name: '모든 곡',
    page: 'songs'
  },
  {
    name: '플레이리스트',
    page: 'playlists'
  },
  {
    name: '최근 재생 목록',
    page: 'recent'
  },
  {
    name: '설정',
    page: 'settings'
  }
]

const LLCTThemeDefault = {
  useDarkMode: false,
  currentTab: 0,
  tabs: Tabs
}

const ThemeReducer = (
  state = LLCTThemeDefault,
  action: UIReducerAction
): typeof LLCTThemeDefault => {
  switch (action.type) {
    case 'UPDATE_THEME':
      document.documentElement.classList[
        (action.data as boolean) ? 'add' : 'remove'
      ]('llct-dark')
      return Object.assign(
        {},
        {
          ...state,
          useDarkMode: action.data as boolean
        }
      )
    case 'UPDATE_TAB':
      return Object.assign(
        {},
        {
          ...state,
          currentTab: action.data as number
        }
      )
    default:
      return state
  }
}

export default ThemeReducer

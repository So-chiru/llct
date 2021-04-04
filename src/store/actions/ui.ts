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
    type: '@llct/theme/update',
    data: useDarkMode
  }
}

/**
 * 현재 탭을 변경합니다.
 */
export const updateTab = (tabNumber: number): UIReducerAction => {
  return {
    type: '@llct/tab/update',
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

const addThemeClassToHTML = (bool: boolean) => {
  document.documentElement.classList[bool ? 'add' : 'remove']('llct-dark')
}

const LLCTThemeDefault = {
  useDarkMode: localStorage.getItem('@llct/ui.useDarkMode') === 'true' || false,
  currentTab: 0,
  tabs: Tabs
}

addThemeClassToHTML(LLCTThemeDefault.useDarkMode)

const UIReducer = (
  state = LLCTThemeDefault,
  action: UIReducerAction
): typeof LLCTThemeDefault => {
  switch (action.type) {
    case '@llct/theme/update':
      addThemeClassToHTML (action.data as boolean)

      // TODO : 설정 저장을 한 곳에서 관리하도록 만들기
      localStorage.setItem('@llct/ui.useDarkMode', action.data as string)

      return Object.assign(
        {},
        {
          ...state,
          useDarkMode: action.data as boolean
        }
      )
    case '@llct/tab/update':
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

export default UIReducer

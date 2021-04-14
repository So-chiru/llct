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

const UIDefault = {
  useDarkMode: localStorage.getItem('@llct/ui.useDarkMode') === 'true' || false,
  currentTab: 0,
  tabs: Tabs,
  player: {
    show: false
  }
}

addThemeClassToHTML(UIDefault.useDarkMode)

const UIReducer = (
  state = UIDefault,
  action: UIReducerAction
): typeof UIDefault => {
  switch (action.type) {
    case '@llct/theme/update':
      addThemeClassToHTML(action.data as boolean)

      // TODO : 설정 저장을 한 곳에서 관리하도록 만들기
      localStorage.setItem('@llct/ui.useDarkMode', action.data as string)

      return Object.assign(state, {
        useDarkMode: action.data as boolean
      })
    case '@llct/tab/update':
      return Object.assign(state, {
        currentTab: action.data as number
      })
    case '@llct/player/show':
      return Object.assign(state, {
        player: {
          ...state.player,
          show: action.data
        }
      })
    case '@llct/player/play':
      return action.data
        ? Object.assign(state, {
            player: {
              ...state.player,
              show: true
            }
          })
        : state
    default:
      return state
  }
}

export default UIReducer

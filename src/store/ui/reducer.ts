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

const UIDefault = {
  currentTab: 0,
  tabs: Tabs,
  player: {
    show: false
  }
}

const UIReducer = (
  state = UIDefault,
  action: UIReducerAction
): typeof UIDefault => {
  switch (action.type) {
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

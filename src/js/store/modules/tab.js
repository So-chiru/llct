export const LLCTTabPointer = {
  MAIN: 0,
  MUSIC: 1,
  PLAYLIST: 2,
  SEARCH: 3,
  PLAYER: 4,
  SETTINGS: 5
}

export const LLCTTabs = [
  {
    id: 'MAIN',
    title: '둘러보기'
  },
  {
    id: 'MUSIC',
    title: '곡 목록'
  },
  {
    id: 'PLAYLIST',
    title: '재생목록'
  },
  {
    id: 'SEARCH',
    title: '검색'
  },
  {
    id: 'PLAYER',
    title: '현재 재생중',
    hide: true
  },
  {
    id: 'SETTINGS',
    title: '설정'
  }
]

export const tabModule = {
  namespaced: true,
  state: () => {
    return {
      current: LLCTTabPointer.MAIN,
      previous: LLCTTabPointer.MAIN,
      title: LLCTTabs[LLCTTabPointer.MAIN].title,
      hide: false
    }
  },
  mutations: {
    changeTo: (state, to) => {
      if (typeof LLCTTabs[to] === 'undefined') {
        throw new Error('Given tab is not exists.')
      }

      state.previous = state.current
      state.current = to

      state.title = LLCTTabs[to].title
      state.hide = LLCTTabs[to].hide
    },

    back: state => {
      let current = state.current
      state.current = state.previous
      state.previous = current

      state.title = LLCTTabs[state.current].title
      state.hide = LLCTTabs[state.current].hide
    }
  },
  actions: {}
}

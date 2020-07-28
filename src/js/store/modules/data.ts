import { Module } from 'vuex'

export const getSong = (rootState, id: string) => {
  if (typeof rootState === 'undefined') {
    throw new Error('rootState is not defined.')
  }

  if (typeof id !== 'string') {
    throw new Error('id is not defined.')
  }

  let group = Object.keys(rootState.data.lists)[Number(id[0])]
  let groupSongs = rootState.data.lists[group].collection

  let songIndex = parseInt(id.substring(1, id.length)) - 1

  if (groupSongs[songIndex] && groupSongs[songIndex].id === id) {
    return groupSongs[songIndex]
  }

  for (var i = 0; i < groupSongs.length; i++) {
    if (groupSongs[i].id === id) {
      return groupSongs[i]
    }
  }

  return null
}

export const getArtist = (rootState, id: string, artist: number) => {
  if (typeof rootState === 'undefined') {
    throw new Error('rootState is not defined.')
  }

  if (typeof id !== 'string') {
    throw new Error('id is not defined.')
  }

  let groupID = id.substring(0, 1)
  let group = rootState.data.lists[Object.keys(rootState.data.lists)[groupID]]

  if (!group) {
    return null
  }

  return group.meta.artists[artist || 0] || artist || 0
}

interface DataModuleObject {
  recommends: object
  playlists: object
  lists: object
  recentPlayed: Array<LLCTMusic>
  playlistsHolder: object
  getSong: Function
  getArtist: Function
}

export const dataModule: Module<DataModuleObject, null> = {
  namespaced: true,
  state: () => {
    return {
      recommends: {},
      playlists: {},
      lists: {},
      recentPlayed: [],
      playlistsHolder: {},
      getSong,
      getArtist
    }
  },
  mutations: {
    lists (state, data) {
      state.lists = data
    },

    recommends (state, data) {
      state.recommends = data
    },

    playlists (state, data) {
      state.playlists = data
    },

    addRecentPlayed (state, metadata) {
      if (!state.recentPlayed) {
        state.recentPlayed = []
      }
      if (state.recentPlayed[0] && state.recentPlayed[0].id === metadata.id) {
        return
      }
      if (state.recentPlayed.length > 1) {
        for (var i = 0; i < state.recentPlayed.length; i++) {
          if (state.recentPlayed[i].id === metadata.id) {
            state.recentPlayed.splice(i, 1)
            i--
          }
        }
      }
      state.recentPlayed.unshift(metadata)
      if (state.recentPlayed.length > 12) {
        state.recentPlayed.splice(state.recentPlayed.length - 1, 1)
      }

      localStorage.setItem(
        'LLCT.RecentPlayed',
        JSON.stringify(state.recentPlayed)
      )
    },

    playlistsHolder (state, holder) {
      state.playlistsHolder = holder
    }
  },
  actions: {}
}

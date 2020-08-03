import { LLCTTabPointer } from './tab'
import settings from '../../core/settings'
import { Module } from 'vuex'

interface PlayerPlayObject {
  state: number
  ing: boolean
  able: boolean
  progress: number
  autoplay: boolean
}

interface PlayerSettingsObject {
  usePlayer: boolean
  audioVolume?: number | null
  tickVolume?: number | null
  bassVolume?: number | null
  speed: number
  live: boolean
  native: boolean
  repeat: number
}

interface PlayerMetadataObject {
  id: string
  title: string
  artist: number | null
  cover?: string | null
  translated?: string
}

interface PlayerModuleState {
  audio: null
  playlist: null

  play: PlayerPlayObject
  metadata: PlayerMetadataObject
  settings: PlayerSettingsObject
}

export const LLCTPlayState = {
  UNLOAD: 0,
  PLAYING: 1,
  PAUSED: 2,
  LOADING: 3,
  PLAY_LOADING: 4,
  DISRUPT: 5
}

export const LLCTRepeatState = {
  NO_REPEAT: 0,
  REPEAT_ONE: 1,
  REPEAT_PLAYLIST: 2
}

export const playerModule: Module<PlayerModuleState, null> = {
  namespaced: true,
  state: () => {
    return {
      audio: null,
      playlist: null,
      metadata: {
        id: '',
        title: '',
        artist: null,
        cover: null,
        translated: ''
      },
      play: {
        state: LLCTPlayState.UNLOAD,
        ing: false,
        able: false,
        progress: 0,
        autoplay: false
      },
      settings: {
        usePlayer: true,
        audioVolume: null,
        tickVolume: null,
        bassVolume: null,
        speed: 1,
        live: false,
        native: false,
        repeat: LLCTRepeatState.NO_REPEAT
      }
    }
  },
  mutations: {
    play (state, data) {
      state.metadata.id = data.id
      state.metadata.title = data.title
      state.metadata.artist = data.artist
      state.metadata.translated = data.tr || data.title
    },

    playStateUpdate (state, bool: boolean) {
      state.play.ing = bool || false
    },

    ableStateUpdate (state, bool: boolean) {
      state.play.able = bool || false
    },

    playOnLoad (state, bool: boolean) {
      state.play.autoplay = bool || false
    },

    playlist (state, data) {
      state.playlist = data
    },

    repeat (state, statenum) {
      state.settings.repeat = statenum
    }
  },
  actions: {
    play ({ rootState, commit }, args) {
      let song

      if (typeof args.id === 'string' && args.id.length == 5) {
        song = rootState.data.getSong(rootState, args.id)
      } else if (typeof args.obj === 'object') {
        song = args.obj
      } else if (typeof args.playlist === 'object') {
        song = rootState.data.getSong(
          rootState,
          args.playlist.lists[args.playlistIndex || 0]
        )
        commit('playlist', args.playlist)
      } else {
        throw new Error('args.id or args.obj is not defined.')
      }

      commit('play', song)

      if (window['app']) {
        window.app.$store.commit('data/addRecentPlayed', song)
      }

      if (args.moveTab && window['app']) {
        window.app['changeTab'](LLCTTabPointer.PLAYER)
      }

      if (args.playOnLoad) {
        commit('playOnLoad', true)
      }

      if (!args.noURLState) {
        history.pushState(
          { ...song, playlist: window.app.$store.state.player.playlist },
          song.title + ' - LLCT',
          '?id=' + song.id
        )
      }

      if (settings.get('usePlayer')) {
        window.audio.load(
          window.app['$llctDatas'].base +
            '/audio/' +
            song.id +
            `${window.audioFlags ? '?flags=' + window.audioFlags : ''}`
        )
      }

      if (window.gtag) {
        window.gtag('event', 'play song v2', {
          event_category: 'audio',
          event_label: song.title
        })
      }
    }
  }
}

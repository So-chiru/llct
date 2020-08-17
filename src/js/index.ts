import Vue from 'vue'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'

import { store } from './store/index'

import * as Toast from './components/toast'

import LLCTAudio from './core/audio'

declare global {
  interface Window {
    audio: LLCTAudio
    dataLayer: Array<IArguments>

    app: Vue
    menu: Vue

    audioFlags: string | null

    settings: Object
  }

  interface Document {
    documentMode?: any
  }
}

window.audioFlags = new URLSearchParams(window.location.search).get('flags')

declare module 'vue/types/vue' {
  interface Vue {
    $llctDatas: Vue
  }
}

const Data = require('./core/data')

import * as worker from './core/worker'
import settings from './core/settings'

Vue.use(Vuex)

import './components/main/app'
import './components/main/menu'

import './components/tabs/ayumu'
import './components/tabs/chika'
import './components/tabs/kotori'
import './components/tabs/player'
import './components/tabs/search'
import './components/tabs/setsuna'

Vue.prototype.$llctEvents = new Vue()

let webpSupport = false
;(() => {
  let img = new Image()
  img.onload = () => (webpSupport = img.width > 0 && img.height > 0)
  img.onerror = () => (webpSupport = false)
  img.src =
    'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
})()

Vue.use(VueLazyload, {
  observer: true,

  filter: {
    webp (listener: HTMLImageElement) {
      if (!webpSupport) return
      if (/\/cover\/\d+\//.test(listener.src)) {
        listener.src += '?webp'
      }
    }
  }
})

const init = () => {
  if (!navigator.onLine) {
    setTimeout(() => {
      Toast.show(
        '오프라인 상태입니다. 저장된 곡만 재생할 수 있습니다.',
        'warning',
        false,
        2000,
        () => {}
      )
    }, 0)
  }

  var audio = new LLCTAudio(false, false, settings.get('useNativeMode') || false)
  window.audio = audio
  window.audio.useFadeInOut = settings.get('useFadeInOut') || false

  var app = new Vue({
    el: 'llct-app',
    store,
    methods: {
      changeTab (id: string) {
        this.$store.commit('tab/changeTo', id)
      },

      goBackTab () {
        this.$store.commit('tab/changeTo', this.$store.state.tab.previous)
      },

      play (
        id: string,
        noURLState: boolean,
        playOnLoad: boolean,
        moveTab: boolean,
        playlistIndex: number
      ) {
        this.$store.dispatch('player/play', {
          id,
          noURLState,
          playOnLoad,
          moveTab,
          playlistIndex
        })
      }
    },
    mounted () {
      this.$root.$llctDatas.$on('listsLoaded', () => {
        let id = new URLSearchParams(window.location.search).get('id')

        if (!id) {
          return
        }

        this.$store.dispatch('player/play', {
          id,
          moveTab: true,
          noURLState: true,
          playOnLoad: false,
          playlistIndex: null
        })
      })

      window.addEventListener('popstate', ev => {
        if (!ev.state) {
          this.goBackTab()
          return
        }

        this.$store.dispatch(
          'player/play',
          ev.state.playlist
            ? {
                playlist: ev.state.playlist,
                moveTab: true,
                noURLState: true,
                playOnLoad: true,
                playlistIndex: ev.state.playlist.__pointer
              }
            : {
                playlist: ev.state.playlist,
                moveTab: true,
                noURLState: true,
                playOnLoad: true,
                playlistIndex: null
              }
        )
      })
    }
  })

  var menu = new Vue({
    el: 'llct-menu',
    store
  })

  window.app = app
  window.menu = menu
}

window.addEventListener('DOMContentLoaded', () => {
  if (window.document.documentMode) {
    location.href = 'https://browser-update.org/update-browser.html'
  }

  // darkMode

  let dark = settings.get('useDarkMode')

  if (dark) {
    document.querySelector('html')!.classList.add('dark')
  }

  document.head
    .querySelector('meta[name="theme-color"')
    ?.setAttribute('content', dark ? '#151515' : '#fff')

  // color Blind

  let tritanomaly = settings.get('useTritanomaly')
  let monochromacy = settings.get('useMonochromacy')

  if (tritanomaly) {
    document.querySelector('html')!.classList.add('tritanomaly')
  } else if (monochromacy) {
    document.querySelector('html')!.classList.add('monochromacy')
  }
})

window.addEventListener('load', () => {
  init()
  worker.register()

  let s = document.createElement('script')
  s.src = 'https://www.googletagmanager.com/gtag/js?id=UA-111995531-2'
  document.querySelector('head')!.appendChild(s)

  window.dataLayer = window.dataLayer || []
  function gtag (...args: any) {
    window.dataLayer.push(...args)
  }
  gtag('js', new Date())
  gtag('config', 'UA-111995531-2')
})

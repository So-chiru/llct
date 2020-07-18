import Vue from 'vue'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'

import { store } from './store/index'

import * as Toast from './components/toast'

import LLCTAudio from './core/audio'

const Data = require('./core/data')

const worker = require('./core/worker')
const settings = require('./core/settings')

Vue.use(Vuex)

require('./components/main/app')
require('./components/main/menu')

require('./components/toast')

require('./components/tabs/ayumu')
require('./components/tabs/chika')
require('./components/tabs/kotori')
require('./components/tabs/player')
require('./components/tabs/search')
require('./components/tabs/setsuna')

Vue.prototype.$llctEvents = new Vue()

var siteTest = /lovelivec\.kr/g

const queryString = name => {
  return new URLSearchParams(window.location.search).get(name)
}

Vue.use(VueLazyload, {
  filter: {
    webp (listener, _) {
      if (!window.webpSupport || !siteTest.test(listener.src)) return
      listener.src += '?webp'
    }
  }
})
;(() => {
  var img = new Image()
  img.onload = function () {
    var result = img.width > 0 && img.height > 0
    window.webpSupport = result
  }
  img.onerror = function () {
    window.webpSupport = false
  }
  img.src =
    'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
})()

const init = () => {
  var audio = new LLCTAudio(false, null, settings.get('useNativeMode') || false)
  window.audio = audio
  window.audio.useFadeInOut = settings.get('useFadeInOut') || false

  if (!navigator.onLine) {
    setTimeout(() => {
      Toast.show(
        '오프라인 상태입니다. 저장된 곡만 재생할 수 있습니다.',
        'warning',
        false,
        2000
      )
    }, 0)
  }

  var app = new Vue({
    el: 'llct-app',
    store,
    methods: {
      changeTab (id) {
        this.$store.commit('tab/changeTo', id)
      },

      goBackTab () {
        this.$store.commit('tab/changeTo', this.$store.state.tab.previous)
      },

      play (id, noURLState, playOnLoad, moveTab, playlistIndex) {
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
      this.$llctDatas.$on('listsLoaded', _ => {
        let id = queryString('id')

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

const isIE = () => {
  return window.document.documentMode
}

window.addEventListener('DOMContentLoaded', () => {
  if (isIE()) {
    location.href = 'https://browser-update.org/update-browser.html'
  }

  // darkMode

  let dark = settings.get('useDarkMode')

  if (dark) {
    document.querySelector('html').classList.add('dark')
  }

  document.head
    .querySelector('meta[name="theme-color"')
    .setAttribute('content', dark ? '#151515' : '#fff')

  // color Blind

  let tritanomaly = settings.get('useTritanomaly')
  let monochromacy = settings.get('useMonochromacy')

  if (tritanomaly) {
    document.querySelector('html').classList.add('tritanomaly')
  } else if (monochromacy) {
    document.querySelector('html').classList.add('monochromacy')
  }
})

window.addEventListener('load', () => {
  init()
  worker.register()

  let s = document.createElement('script')
  s.src = 'https://www.googletagmanager.com/gtag/js?id=UA-111995531-2'
  document.querySelector('head').appendChild(s)

  window.dataLayer = window.dataLayer || []
  function gtag () {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'UA-111995531-2')
})

Vue.prototype.$llctEvents = new Vue()
Vue.prototype.$llctPlaylist = window.playlists

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
  // lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
  // alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
})()

const init = () => {
  var audio = new LLCTAudio(false)
  window.audio = audio

  var app = new Vue({
    el: 'llct-app',
    data: () => {
      return {
        tabs: [
          {
            title: '둘러보기'
          },
          {
            title: '곡 목록'
          },
          {
            title: '재생목록'
          },
          {
            title: '현재 재생중',
            hide: true
          },
          {
            title: '설정'
          }
        ],
        currentTab: 0,
        title: '둘러보기'
      }
    },
    methods: {
      updateTitle (title, hide) {
        this.title = title
        this.hide = hide
      },

      changeTab (id) {
        this.prevTab = this.currentTab || 0

        if (this.tabs[id]) {
          this.updateTitle(this.tabs[id].title, this.tabs[id].hide || false)
        }

        this.currentTab = id
        this.$llctEvents.$emit('changeTab', id)
      },

      goBackTab () {
        return this.changeTab(this.prevTab)
      }
    },
    mounted () {
      this.changeTab(0)

      this.$llctEvents.$on('requestChangeTab', id => {
        this.changeTab(id)
      })

      this.$llctEvents.$on('requestGoBack', () => {
        this.goBackTab()
      })

      this.$llctEvents.$on(
        'play',
        (id, noState, playActive, noTab, playlistIndex) => {
          if (typeof id === 'object') {
            let pl = playlists.find(id.title, true)

            playlists.lists[pl].__pointer = playlistIndex
            window.audio.playlist = playlists.lists[pl].title

            if (typeof playlistIndex === 'number') {
              id = playlists.lists[pl].lists[playlistIndex].id
            }
          } else {
            window.audio.playlist = null
          }

          let info = this.$llctDatas.getSong(id)
          if (!noTab && this.$llctDatas.meta == info) {
            this.changeTab(3)
            return false
          }

          if (!noState) {
            history.pushState(
              { id, ...info, playlist: window.audio.playlist },
              info.title + ' - LLCT',
              '?id=' + id
            )
          }

          this.$llctDatas.meta = info
          this.$llctDatas.playActive =
            typeof playActive !== 'undefined' ? playActive : true
          
          if (LLCTSettings.get('usePlayer')) {
            audio.load(this.$llctDatas.base + '/audio/' + id)
          }

          if (!noTab) {
            this.changeTab(3)
          } else {
            this.$llctEvents.$emit('callContentChange')
          }
        }
      )

      this.$nextTick(() => {
        let idQs = queryString('id')
        if (idQs) {
          setTimeout(() => {
            this.$llctEvents.$emit('play', idQs, true, false, false)
          }, 0)
        }
      })

      window.addEventListener('popstate', ev => {
        if (!ev.state) {
          this.goBackTab()
          return
        }

        this.$llctEvents.$emit(
          'play',
          ev.state.playlist ? ev.state.playlist : ev.state.id,
          true,
          true,
          true,
          ev.state.playlist ? ev.state.playlist.__pointer : null
        )
      })
    }
  })

  var menu = new Vue({
    el: 'llct-menu',
    methods: {
      changeTab (id) {
        app.changeTab(id)
      }
    }
  })

  window.app = app
  window.menu = menu
}

const darkInit = () => {
  let dark = LLCTSettings.get('useDarkMode')

  if (dark) {
    document.querySelector('body').classList.add('dark')
  }
}

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
})()

const preInit = () => {
  window.addEventListener('songReceive', _data => {
    let qs = queryString('id')
    if (!qs) return false

    let v = new Vue()

    if (!v.$llctEvents.playEventInit) {
      v.$llctEvents.playQueue = qs
      return
    }

    v.$llctEvents.$emit('play', qs, true, false, false)
  })
}

const init = () => {
  var audio = new LLCTAudio(false, null, LLCTSettings.get('useNativeMode') || false)
  window.audio = audio

  window.audio.useFadeInOut = LLCTSettings.get('useFadeInOut') || false

  window.addEventListener('errorReceive', ev => {
    window.showToast(
      'API 서버에 연결할 수 없습니다. ' + ev.detail.message,
      'warning',
      true,
      10000
    )
  })

  window.addEventListener('recommendReceive', ev => {
    if (ev.detail.Notices && ev.detail.Notices.Msg.length) {
      window.showToast(
        ev.detail.Notices.Msg,
        ev.detail.Notices.Icon,
        ev.detail.Notices.Type,
        ev.detail.Notices.Time
      )
    }
  })

  if (!navigator.onLine) {
    setTimeout(() => {
      window.showToast(
        '오프라인 상태입니다. 저장된 곡만 재생할 수 있습니다.',
        'warning',
        false,
        2000
      )
    }, 0)
  }

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
            title: '검색'
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
            this.changeTab(4)
            return false
          }

          if (!noState) {
            history.pushState(
              { id, ...info, playlist: window.audio.playlist },
              info.title + ' - LLCT',
              '?id=' + id
            )
          }

          this.$llctDatas.addRecentPlayed({ id, ...info })

          this.$llctDatas.meta = info
          this.$llctDatas.playActive =
            typeof playActive !== 'undefined' ? playActive : true

          if (LLCTSettings.get('usePlayer')) {
            audio.load(this.$llctDatas.base + '/audio/' + id)
          }

          if (!noTab) {
            this.changeTab(4)
          } else {
            this.$llctEvents.$emit('callContentChange')
          }

          if (window.gtag) {
            gtag('event', 'play song', {
              event_category: 'audio',
              event_label: this.$llctDatas.meta.title
            })
          }
        }
      )

      this.$llctEvents.playEventInit = true

      if (this.$llctEvents.playQueue) {
        this.$llctEvents.$emit(
          'play',
          this.$llctEvents.playQueue,
          true,
          false,
          false
        )
        this.$llctEvents.playQueue = null
      }

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
    document.querySelector('html').classList.add('dark')
  }

  document.head
    .querySelector('meta[name="theme-color"')
    .setAttribute('content', dark ? '#151515' : '#fff')
}

const colorBlindInit = () => {
  let tritanomaly = LLCTSettings.get('useTritanomaly')
  let monochromacy = LLCTSettings.get('useMonochromacy')

  if (tritanomaly) {
    document.querySelector('html').classList.add('tritanomaly')
  } else if (monochromacy) {
    document.querySelector('html').classList.add('monochromacy')
  }
}

const __llct_optslists = [
  {
    id: 'showAs_translated',
    data_key: 'mikan',
    checkbox: true,
    default: false,
    fn: _v => {
      setTimeout(() => {
        if (pageAdjust) {
          pageAdjust.buildPage()
        }
      }, 100)
    }
  },
  {
    id: 'darkMode',
    data_key: 'yohane',
    checkbox: true,
    default: false,
    fn: v => {
      document
        .getElementsByTagName('body')[0]
        .classList[v == 'true' || v == true ? 'add' : 'remove']('dark')
    },
    load_check: () => {
      var mtc = window.matchMedia('(prefers-color-scheme: dark)').matches
      return [mtc, false]
    }
  },
  {
    id: 'reduceMotion',
    data_key: 'zuramaru',
    checkbox: true,
    default: false,
    fn: v => {
      document
        .getElementsByTagName('body')[0]
        .classList[v == 'true' || v == true ? 'add' : 'remove']('no-motion')
    },
    load_check: () => {
      var mtc = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return [mtc, mtc]
    }
  },
  {
    id: 'useInteractiveCall',
    data_key: 'interactiveCall',
    checkbox: true,
    default: true,
    fn: _v => {}
  },
  {
    id: 'doNotUseMusicPlayer',
    data_key: 'notUsingMP',
    checkbox: true,
    default: false,
    fn: (v, first) => {
      if ((v === 'true' || v == true) && !first) {
        yohane.giran()
      }
    }
  },
  {
    id: 'useRomaji',
    data_key: 'romaji',
    checkbox: true,
    default: false,
    fn: v => {}
  },
  {
    id: 'useAlbumImage',
    data_key: 'sakana',
    checkbox: true,
    default: true,
    fn: v => {
      setTimeout(() => {
        if (pageAdjust) {
          pageAdjust.buildPage()
        }
      }, 100)
    }
  },
  {
    id: 'useAmbientBackground',
    data_key: 'piigi',
    checkbox: true,
    default: true,
    fn: v => {}
  },
  {
    id: 'useOfflineSaving',
    data_key: 'offlineShip',
    checkbox: true,
    default: window.navigator.standalone === true,
    fn: v => {
      if ('serviceWorker' in navigator) {
        if (!v) {
          navigator.serviceWorker
            .getRegistrations()
            .then(r => {
              for (let _rs of r) {
                _rs.unregister()
              }
            })
            .catch(e =>
              logger.error(2, 's', 'Failed to get ServiceWorker. ' + e.message)
            )

          return
        }

        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then(_regi => {
            logger.info(2, 's', 'ServiceWorker registered. Yosoro~')

            _regi.addEventListener('updatefound', () => {
              window.ServWorkerInst = _regi.installing

              ServWorkerInst.addEventListener('statechange', () => {
                if (ServWorkerInst.state !== 'installed') return 0
                Popup.show(
                  'update',
                  '새로운 콜표 업데이트가 있습니다. 여기를 눌러 새로 고쳐주세요.',
                  () => {
                    location.reload()
                  }
                )
              })
            })
          })
          .catch(e =>
            logger.error(
              2,
              's',
              'Failed to register ServiceWorker. ' + e.message
            )
          )

        navigator.serviceWorker.addEventListener('message', obj_inf => {
          if (typeof obj_inf !== 'object') return 0

          if (obj_inf.data.cmd_t === 'popup') {
            Popup.show(obj_inf.data.data.icon, obj_inf.data.data.text)
            return
          }

          Sakurauchi.run(obj_inf.data.cmd_t, obj_inf.data.data)
        })
      }
    }
  },
  {
    id: 'offlineCacheClearBtn',
    button: true,
    filt: _v => {
      return !dataYosoro.get('offlineShip')
    },
    fn: _ => {
      LLCT.clearCache()
    }
  }
]

const OptionManager = {
  get: () => {
    return __llct_optslists
  },

  first: true,

  init: () => {
    var ol = __llct_optslists.length
    for (var i = 0; i < ol; i++) {
      var oi = __llct_optslists[i]
      var val = dataYosoro.get(oi.data_key)
      var _e = document.getElementById(oi.id)

      if (
        typeof oi.data_key !== 'undefined' &&
        (typeof val === 'undefined' || val == null)
      ) {
        dataYosoro.set(oi.data_key, oi.default)
        val = oi.default
      }

      if (oi.button) {
        _e.disabled = oi.filt ? oi.filt() : false

        _e.onclick = () => {
          oi.fn(null, OptionManager.first)
          _e.disabled = oi.filt ? oi.filt() : false
        }
      } else if (oi.checkbox) {
        _e.checked = val == 'true' || val == true
        oi.fn(val, OptionManager.first)

        _e.onclick = ((oi, _e) => {
          return () => {
            var v = _e.checked

            oi.fn(v, OptionManager.first)
            dataYosoro.set(oi.data_key, v)
          }
        })(oi, _e)
      }

      if (oi.load_check) {
        var lc = oi.load_check()

        if (oi.checkbox) {
          _e.checked = lc[0]
        }
        _e.disabled = lc[1]
      }
    }

    OptionManager.first = false
  }
}

document.addEventListener('DOMContentLoaded', () => {
  OptionManager.init()
})

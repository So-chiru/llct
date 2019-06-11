const __llct_optslists = [
  {
    id: 'showAs_translated',
    data_key: 'mikan',
    checkbox: true,
    default: false,
    fn: _v => {
      setTimeout(() => {
        pageAdjust.buildPage()
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
    fn: v => {
      if (v === 'true' || v == true) {
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
        pageAdjust.buildPage()
      }, 100)
    }
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
              logger(2, 's', 'Failed to get ServiceWorker. ' + e.message, 'e')
            )

          return
        }

        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then(_regi => {
            logger(2, 's', 'ServiceWorker registered. Yosoro~', 'i')

            _regi.addEventListener('updatefound', () => {
              window.ServWorkerInst = _regi.installing

              ServWorkerInst.addEventListener('statechange', () => {
                if (ServWorkerInst.state !== 'installed') return 0
                _glb_ShowPopup(
                  'offline_bolt',
                  '새로운 업데이트가 있습니다. 이곳을 눌러 새로 고칠 수 있습니다.',
                  () => {
                    location.reload()
                  }
                )
              })
            })
          })
          .catch(e =>
            logger(
              2,
              's',
              'Failed to register ServiceWorker. ' + e.message,
              'e'
            )
          )

        navigator.serviceWorker.addEventListener('message', obj_inf => {
          if (typeof obj_inf !== 'object') return 0

          if (obj_inf.data.cmd_t === 'popup') {
            _glb_ShowPopup(obj_inf.data.data.icon, obj_inf.data.data.text)
            return
          }

          Sakurauchi.run(obj_inf.data.cmd_t, obj_inf.data.data)
        })
      }
    }
  },
  {
    id: 'useSetIntervalInstead',
    data_key: 'funeTiming',
    checkbox: true,
    default: false,
    fn: v => {
      requestAudioSync = null
      yohane.reInitTimingFunction()
      yohane.tick()
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
          oi.fn()
          _e.disabled = oi.filt ? oi.filt() : false
        }
      } else if (oi.checkbox) {
        _e.checked = val == 'true' || val == true
        oi.fn(val)

        _e.onclick = ((oi, _e) => {
          return () => {
            var v = _e.checked

            oi.fn(v)
            dataYosoro.set(oi.data_key, v)
          }
        })(oi, _e)
      }
    }
  }
}

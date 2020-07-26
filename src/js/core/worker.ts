import * as Toast from '../components/toast'
import settings from './settings'

export let showNotification

declare global {
  interface Window {
    getSize: Function
    clearCaches: Function
  }
}

window.getSize = () => {
  navigator.serviceWorker.controller.postMessage('getSizes')
}

window.clearCaches = () => {
  navigator.serviceWorker.controller.postMessage('clearCaches')
}

export const register = () => {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  let useNotification = settings.get('useNotification')

  if ('Notification' in window && useNotification) {
    Notification.requestPermission()
  }

  navigator.serviceWorker.register('/worker.js').then(
    reg => {
      if (
        useNotification &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        showNotification = reg.showNotification
      }
    },
    err => {
      Toast.show(
        '서비스 워커 등록 실패, ' + err.message,
        'warning',
        true,
        2000,
        null
      )
    }
  )

  navigator.serviceWorker.addEventListener('controllerchange', ev => {
    window.getSize()
  })

  navigator.serviceWorker.addEventListener('message', ev => {
    if (!ev.data) return ev

    if (ev.data.cmd == 0x01) {
      Toast.show(
        '페이지 업데이트가 있습니다. 팝업을 눌러 새로 고치세요.',
        'cloud_done',
        false,
        10000,
        () => {
          location.reload()
        }
      )
    } else if (ev.data.cmd == 0x02) {
      if (window.app) {
        window.app['$llctDatas']['cacheSize'] = 0
      }

      if (ev.data.removed) {
        Toast.show(
          ev.data.removed + ' 바이트를 캐시에서 제거했습니다.',
          'delete',
          false,
          1000,
          null
        )
      }
    }
  })
}

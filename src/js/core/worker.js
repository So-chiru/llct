import * as Toast from '../components/toast'

export const register = () => {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  navigator.serviceWorker.register('/worker.js').then(
    _ => {},
    err => {
      Toast.show('서비스 워커 등록 실패, ' + err.message, 'warning', true, 2000)
    }
  )

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
    }
  })
}

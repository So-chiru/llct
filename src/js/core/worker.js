const registerWorker = () => {
  let useOffline = LLCTSettings.get('useOffline')

  if (!'serviceWorker' in navigator) {
    return false
  }

  navigator.serviceWorker.register('/worker.js').then(reg => {
    
  }, (err) => {
    window.showToast(
      '서비스 워커 등록 실패',
      'warning',
      true,
      2000
    )
  });
}

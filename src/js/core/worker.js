const registerWorker = () => {
  let useOffline = LLCTSettings.get('useOffline')

  if (!'serviceWorker' in navigator) {
    return false
  }

  console.log(useOffline)
}

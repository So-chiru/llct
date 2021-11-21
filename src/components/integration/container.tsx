import { useSelector, useDispatch } from 'react-redux'

import { RootState } from '@/store/index'

const useSpotifyEvents = () => {
  const spotify = useSelector((state: RootState) => state.spotify)
  const dispatch = useDispatch()

  const handler = () => {
    if (!spotify.use) {
      dispatch({
        type: '@llct/spotify/connect',
      })
    } else {
      dispatch({
        type: '@llct/spotify/disconnect',
      })
    }
  }

  window.onSpotifyWebPlaybackSDKReady = () => {
    alert('아직 플레이어가 준비되지 않았습니다.')
  }

  const connectHandler = (connected: boolean) => {
    if (connected) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.id = 'spotify-audio-src'

      window.onSpotifyWebPlaybackSDKReady = () => {
        spotify.session.initialize()
      }

      document.querySelector('head')!.appendChild(script)
    } else {
      const script = document.getElementById('spotify-audio-src')
      script?.parentElement!.removeChild(script)
    }

    requestAnimationFrame(() => {
      dispatch({
        type: '@llct/tab/setTabList',
        data: connected,
      })
    })

    requestAnimationFrame(() => {
      dispatch({
        type: '@llct/spotify/setConnected',
      })
    })

    requestAnimationFrame(() => {
      dispatch({
        type: '@llct/player/setAudioAvailable',
        data: connected,
      })
    })
  }

  const connectedId = spotify.session.events.on('connected', connectHandler)
  connectHandler(spotify.session.connected)

  window.addEventListener('toggleSpotify', handler)

  return () => {
    spotify.session.events.off('connected', connectedId)
    window.removeEventListener('toggleSpotify', handler)
  }
}

const SpotifyIntegrationContainer = () => {
  useSpotifyEvents()

  return <></>
}

export default SpotifyIntegrationContainer

import eventBus from '../eventbus'
import store from '../store'

interface SpotifyEvents {
  connected: (connected: boolean) => void
  SDKReady: () => void
}

export default class SpotifySessionManager {
  token?: string
  __connected = false
  expires = 0
  events: eventBus<SpotifyEvents>
  player?: Spotify.Player

  constructor () {
    this.events = new eventBus()

    if (this.checkURLToken() || this.checkSavedToken()) {
      this.connected = true
    }
  }

  get connected () {
    return this.__connected
  }

  set connected (connected) {
    if (this.connected != connected) {
      this.__connected = connected
      this.events.runAll('connected', connected)
    }
  }

  connect () {
    if (!this.checkURLToken()) {
      this.requestOAuthCode()
    }

    this.connected = true
  }

  disconnect () {
    this.token = ''
    store.remove('spotify/token')
    store.remove('spotify/expireAt')

    this.connected = false
  }

  checkURLToken () {
    const url = new URL(location.href)

    if (url.searchParams.has('spotifyToken')) {
      this.token = url.searchParams.get('spotifyToken') || undefined
      store.set('spotify/token', this.token)

      if (url.searchParams.has('spotifyExpires')) {
        this.expires = Number(url.searchParams.get('spotifyExpires')) || 3600
        store.set('spotify/expireAt', Date.now() + this.expires * 990)
      }

      return true
    }

    return false
  }

  checkSavedToken () {
    const token = store.get('spotify/token') as string
    const expireAt = store.get('spotify/expireAt') as number

    if (expireAt && Date.now() > expireAt) {
      store.remove('spotify/token')
      store.remove('spotify/expireAt')

      this.requestTokenRefresh()
    } else if (token) {
      this.token = token
      return true
    }

    return false
  }

  requestOAuthCode () {
    window.location.href =
      process.env.API_SERVER +
      '/spotify/oauth?from=' +
      encodeURIComponent(location.origin + location.pathname)
  }

  requestTokenRefresh () {
    fetch(process.env.API_SERVER + '/spotify/refresh_token')
  }

  initialize () {
    if (!this.token) {
      return
    }

    this.events.runAll('SDKReady')
  }
}

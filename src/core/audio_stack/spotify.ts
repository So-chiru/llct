import eventBus from '@/core/eventbus'

import { LLCTAudioStack, LLCTExternalMetadata } from '@/@types/audio'
import { LLCTAudioStackEventMap } from '@/@types/audio'
import SpotifySessionManager from '../integration/spotify'

export default class LLCTSpotifyAudio implements LLCTAudioStack {
  src?: string
  session: SpotifySessionManager
  private volumeStore: number

  deviceId: string

  supportEffects = false
  events = new eventBus<LLCTAudioStackEventMap>()
  type = 'spotify'

  external = true

  notSiteSong = false

  externalMetadata?: LLCTExternalMetadata

  private stateCache?: Spotify.PlaybackState | null
  private stateInterval?: number
  private lastTick?: number
  private ticker?: number

  constructor (session: SpotifySessionManager) {
    this.deviceId = ''
    this.volumeStore = 1
    this.session = session

    this.handlerInit()
  }

  destroy () {
    this.stopTicker()
  }

  async stateIntervalHandler () {
    const fetchStart = performance.now()
    this.stateCache = await this.session.player!.getCurrentState()
    if (this.stateCache && !this.stateCache.paused) {
      this.stateCache.position += performance.now() - fetchStart
    }

    this.volumeStore = await this.session.player!.getVolume()
  }

  private startInterval () {
    this.stateInterval = (setInterval(
      this.stateIntervalHandler.bind(this),
      50
    ) as unknown) as number
  }

  private stopInterval () {
    if (this.stateInterval) {
      clearInterval(this.stateInterval)
    }
  }

  private startTicker () {
    this.tickerHandler()

    this.ticker = requestAnimationFrame(this.startTicker.bind(this))
  }

  private stopTicker () {
    if (this.ticker) {
      cancelAnimationFrame(this.ticker)
    }
  }

  private tickerHandler () {
    if (!this.stateCache) {
      return
    }

    if (!this.lastTick) {
      this.lastTick = performance.now()
      return
    }

    if (!this.stateCache.paused && !this.stateCache.loading) {
      this.stateCache.position += performance.now() - this.lastTick
    }

    this.lastTick = performance.now()
  }

  initializePlayer () {
    this.session.player = new Spotify.Player({
      name: 'LLCT',
      getOAuthToken: cb => {
        cb(this.session.token!)
      },
      volume: 0.5,
    })

    this.session.player.addListener('ready', instance => {
      this.deviceId = instance.device_id
      this.events.runAll('playerID', this.deviceId)
      this.events.runAll('metadata')
    })

    let lastPausedState: boolean
    let lastDuration: number
    let lastPlayingSong: string

    this.session.player.addListener('player_state_changed', s => {
      if (lastPlayingSong !== s.track_window.current_track.uri) {
        this.notSiteSong = s.track_window.current_track.uri !== this.src
        lastPlayingSong = s.track_window.current_track.uri

        if (this.notSiteSong) {
          this.externalMetadata = {
            title: s.track_window.current_track.name,
            artist: s.track_window.current_track.artists
              .map(v => v.name)
              .join(', '),
            image: s.track_window.current_track.album.images[0].url,
          }

          this.events.runAll('siteMetadataUpdate', this.externalMetadata)
        } else {
          this.externalMetadata = undefined
          this.events.runAll('siteMetadataUpdate', undefined)
        }

        this.events.runAll('siteSongUpdate', !this.notSiteSong)
      }

      if (lastPausedState !== s.paused) {
        lastPausedState = s.paused
        this.events.runAll(s.paused ? 'pause' : 'play')
      }

      if (lastDuration !== s.duration) {
        lastDuration = s.duration
        this.events.runAll('metadata')
      }

      console.debug(s)

      this.stateCache = s
    })

    this.session.player.addListener('initialization_error', ({ message }) => {
      console.error(message)
    })

    this.session.player.addListener('authentication_error', ({ message }) => {
      console.error(message)
    })

    this.session.player.addListener('account_error', ({ message }) => {
      console.error(message)
    })

    this.session.player.connect()
  }

  handlerInit () {
    this.session.events.on('SDKReady', this.initializePlayer.bind(this))

    const start = () => {
      this.startInterval()
      this.startTicker()
    }

    const stop = () => {
      this.stopInterval()
      this.stopTicker()
    }

    this.events.on('play', start)
    this.events.on('pause', stop)

    start()
  }

  play () {
    return this.session.player?.resume()
  }

  pause () {
    return this.session.player?.pause()
  }

  stop () {
    return this.session.player?.pause()
  }

  load (src: string) {
    this.src = src
    this.pause()

    const request = async () =>
      fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            uris: [src],
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.session.token}`,
          },
        }
      ).then(v => {
        if (v.status === 200) this.play()
      })

    if (!this.deviceId) {
      this.events.on('playerID', () => request())
    } else request()
  }

  get current () {
    return (this.stateCache?.position || 0) / 1000
  }

  set current (seek: number) {
    this.session.player
      ?.pause()
      .then(() => this.session.player?.seek(seek * 1000))
      .then(() => this.session.player?.resume())
  }

  get duration () {
    return (this.stateCache?.duration || 0) / 1000
  }

  get progress () {
    return this.current / this.duration
  }

  set progress (seek: number) {
    this.current = (this.duration || 1) * seek
  }

  get timecode () {
    return ~~(this.current * 100)
  }

  get volume () {
    return this.volumeStore
  }

  set volume (vol: number) {
    this.volumeStore = vol
    this.session.player?.setVolume(vol)
  }
}

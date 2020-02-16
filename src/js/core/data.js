const LLCTData = class {
  constructor (base) {
    if (!base) {
      base = '/'
    }

    this.base = base
    this.lists = {}
    this.playlists = []
    this.defaulPlaylistStore = {}
    this.recommends = {}
    this.events = {}
  }

  event (name, data) {
    window.dispatchEvent(new CustomEvent(name + 'Receive', { detail: data }))
  }

  on (name, cb, key) {
    if (!this.events[name]) {
      this.events[name] = []
    }

    var i = this.events[name].length

    while (key && i--) {
      if (this.events[name][i].key == key) return false
    }

    return this.events[name].push({ key, cb })
  }

  off (name) {
    this.events[name] = {}
  }

  run (name, ...params) {
    if (!this.events[name]) return
    let i = this.events[name].length

    while (i--) {
      this.events[name][i].cb(...params)
    }
  }

  songs () {
    return new Promise((resolve, reject) => {
      this.runningGetSong = true

      fetch(this.base + '/lists')
        .then(res => {
          return res.json()
        })
        .then(json => {
          this.lists = json

          resolve(this.lists)

          this.run('song')
          this.runningGetSong = true
        })
        .catch(e => {
          this.event('error', e)

          reject(e)
        })
    })
  }

  recommended () {
    return new Promise((resolve, reject) => {
      fetch(this.base + '/recommend')
        .then(res => {
          return res.json()
        })
        .then(json => {
          this.recommends = json

          this.event('recommend', this.recommends)

          resolve(json)
        })
        .catch(e => {
          this.event('error', e)

          reject(e)
        })
    })
  }

  defaultPlaylist () {
    return new Promise((resolve, reject) => {
      fetch(this.base + '/playlists')
        .then(res => {
          return res.json()
        })
        .then(json => {
          this.defaulPlaylistStore = json

          // this.event('playlist', this.defaulPlaylistStore)

          resolve(json)
        })
        .catch(e => {
          this.event('error', e)

          reject(e)
        })
    })
  }

  karaoke (id) {
    return new Promise((resolve, reject) => {
      fetch(this.base + '/call/' + id)
        .then(res => {
          return res.json()
        })
        .then(json => {
          resolve(json)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

  ; (() => {
  var dataInstance = new LLCTData(
    window.isDev ? 'http://127.0.0.1:10210' : 'https://api.lovelivec.kr'
  )
  Vue.prototype.$llctDatas = new Vue({
    data () {
      return dataInstance
    },
    watch: {
      defaulPlaylistStore (data) {
        window.dispatchEvent(
          new CustomEvent('playlistReceive', {
            detail: { data, getSong: this.getSong }
          })
        )
      }
    },
    methods: {
      refresh () {
        dataInstance.recommended()
      },
      artist (id, artist) {
        let first = id.substring(0, 1)
        let group = Object.keys(dataInstance.lists)[first]

        return group && dataInstance.lists[group]
          ? dataInstance.lists[group].meta.artists[artist] || artist
          : null
      },

      getSong (id) {
        let first = id.substring(0, 1)
        let group = Object.keys(dataInstance.lists)[first]

        let meta = dataInstance.lists[group].collection

        let idInt = parseInt(id.substring(1, id.length)) - 1
        if (meta[idInt] && meta[idInt].id === id) {
          return meta[idInt]
        }

        let i = meta.length
        while (i--) {
          if (meta[i].id == id) return meta[i]
        }

        return null
      },

      getCoverURL (id) {
        return dataInstance.base + '/cover/' + id
      },

      karaoke (id, useImg) {
        return this.getSong(id).karaoke && !useImg
          ? dataInstance.karaoke(id)
          : 'img'
      },

      playlist () {
        return dataInstance.defaultPlaylist()
      }
    }
  })
    
    window.addEventListener('load', () => {
      dataInstance.songs()
      dataInstance.recommended()
      dataInstance.defaultPlaylist()
    })
})()

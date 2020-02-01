const LLCTData = class {
  constructor (base) {
    if (!base) {
      base = '/'
    }

    this.base = base
    this.lists = {}
    this.recommends = {}

    this.songs()
    this.recommended()
  }

  songs () {
    return new Promise((resolve, reject) => {
      fetch(this.base + '/lists')
        .then(res => {
          return res.json()
        })
        .then(json => {
          this.lists = json
        })
        .catch(e => {
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

          resolve(json)
        })
        .catch(e => {
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

;(() => {
  var dataInstance = new LLCTData('https://api.lovelivec.kr')
  Vue.prototype.$llctDatas = new Vue({
    data () {
      return dataInstance
    },
    methods: {
      refresh () {
        dataInstance.recommended()
      },
      artist (id, artist) {
        let first = id.substring(0, 1)
        let group = Object.keys(dataInstance.lists)[first]

        return dataInstance.lists[group].meta.artists[artist] || artist
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

      karaoke (id) {
        return dataInstance.karaoke(id)
      }
    }
  })
})()

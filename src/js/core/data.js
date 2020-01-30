const LLCTData = class {
  constructor (base) {
    if (!base) {
      base = '/'
    }

    this.base = base
    this.lists = {}
    this.recommends = {}

    this.songLists()
    this.recommended()
  }

  songLists () {
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

  search (keyword) {}

  getSong (id) {}

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
      }
    }
  })
})()

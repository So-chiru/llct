// from https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/string/longest-common-substring/longestCommonSubstring.js
const LCS = (string1, string2) => {
  // Convert strings to arrays to treat unicode symbols length correctly.
  // For example:
  // '𐌵'.length === 2
  // [...'𐌵'].length === 1
  const s1 = [...string1]
  const s2 = [...string2]

  // Init the matrix of all substring lengths to use Dynamic Programming approach.
  const substringMatrix = Array(s2.length + 1)
    .fill(null)
    .map(() => {
      return Array(s1.length + 1).fill(null)
    })

  // Fill the first row and first column with zeros to provide initial values.
  for (let columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
    substringMatrix[0][columnIndex] = 0
  }

  for (let rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
    substringMatrix[rowIndex][0] = 0
  }

  // Build the matrix of all substring lengths to use Dynamic Programming approach.
  let longestSubstringLength = 0
  let longestSubstringColumn = 0
  let longestSubstringRow = 0

  for (let rowIndex = 1; rowIndex <= s2.length; rowIndex += 1) {
    for (let columnIndex = 1; columnIndex <= s1.length; columnIndex += 1) {
      if (s1[columnIndex - 1] === s2[rowIndex - 1]) {
        substringMatrix[rowIndex][columnIndex] =
          substringMatrix[rowIndex - 1][columnIndex - 1] + 1
      } else {
        substringMatrix[rowIndex][columnIndex] = 0
      }

      // Try to find the biggest length of all common substring lengths
      // and to memorize its last character position (indices)
      if (substringMatrix[rowIndex][columnIndex] > longestSubstringLength) {
        longestSubstringLength = substringMatrix[rowIndex][columnIndex]
        longestSubstringColumn = columnIndex
        longestSubstringRow = rowIndex
      }
    }
  }

  if (longestSubstringLength === 0) {
    // Longest common substring has not been found.
    return ''
  }

  // Detect the longest substring from the matrix.
  let longestSubstring = ''

  while (substringMatrix[longestSubstringRow][longestSubstringColumn] > 0) {
    longestSubstring = s1[longestSubstringColumn - 1] + longestSubstring
    longestSubstringRow -= 1
    longestSubstringColumn -= 1
  }

  return longestSubstring
}

const chosung = str => {
  let arr = str.split('')

  let iter = arr.length
  while (iter--) {
    if (!/[가-힣]/g.test(arr[iter])) continue

    arr[iter] = String.fromCharCode(
      0x1100 + (arr[iter].charCodeAt(0) - 0xac00) / 28 / 21
    )
  }

  return arr.join('')
}

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
    this.recentPlayed = []

    this.songKeys = []
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

          this.songKeys = Object.keys(this.lists)

          this.run('song')
          this.runningGetSong = true
        })
        .catch(e => {
          this.event('error', e)

          reject(e)
        })
    })
  }

  loadRecent () {
    this.recentPlayed =
      JSON.parse(localStorage.getItem('LLCT.RecentPlayed') || '[]') || []
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

;(() => {
  var dataInstance = new LLCTData(
    window.isDev
      ? 'http://' + window.location.hostname + ':10210'
      : 'https://api.lovelivec.kr'
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
      },
      lists (data) {
        window.dispatchEvent(
          new CustomEvent('songReceive', {
            detail: { data }
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
        let group = this.songKeys[first]

        return group && dataInstance.lists[group]
          ? dataInstance.lists[group].meta.artists[artist || 0] || artist || 0
          : null
      },

      getSong (id) {
        let first = id.substring(0, 1)
        let group = this.songKeys[first]

        let meta = dataInstance.lists[group].collection

        let idInt = Number(id.substring(1, id.length)) - 1
        if (meta[idInt] && meta[idInt].id === id) {
          return meta[idInt]
        }

        let i = meta.length
        while (i--) {
          if (meta[i].id == id) return meta[i]
        }

        return null
      },

      search (keyword) {
        if (keyword === '') {
          return []
        }

        let musics = []

        for (var i = 0; i < this.songKeys.length; i++) {
          musics.push(...dataInstance.lists[this.songKeys[i]].collection)
        }

        let musicsLen = musics.length
        for (var i = 0; i < musicsLen; i++) {
          let music = musics[i]

          let ga = this.artist(music.id, music.artist)

          let searchStr = `${music.title}-${
            music.translated ? music.translated + '-' : ''
          }${music.short_kr ? music.short_kr + '-' : ''}${
            music.tags ? music.tags.join('-') + '.' : ''
          }-${ga}`
            .replace(/\s|[!@#$%^&*(),.?":{}|<>♡★☆○●！]/g, '')
            .toLowerCase()
            .split('-')

          keyword = keyword
            .toLowerCase()
            .replace(/\s|[!@#$%^&*(),.?":{}|<>♡★☆○●！]/g, '')

          let searchIter = searchStr.length
          let rate = 0

          while (searchIter--) {
            let item = searchStr[searchIter]
            let index = item.indexOf(keyword)

            let itemChosung = false

            if (/[ㄱ-ㅎ]/.test(keyword)) {
              itemChosung = chosung(item)
            }

            if (item === '' || (index === -1 && !itemChosung)) {
              continue
            }

            if (item === keyword) {
              rate += 100
            }

            let l = LCS((itemChosung ? itemChosung : '') || item, keyword)

            if (l.length < 1) {
              continue
            }

            rate += 100 * (l.length * (1 - index / item.length))
          }

          if (rate < 10) {
            musics[i] = false

            continue
          }

          musics[i].rate = rate
        }

        musics = musics.filter(v => v !== false).sort((a, b) => b.rate - a.rate)

        return musics
      },

      karaoke (id, useImg) {
        return this.getSong(id).karaoke && !useImg
          ? dataInstance.karaoke(id)
          : 'img'
      },

      playlist () {
        return dataInstance.defaultPlaylist()
      },

      on: dataInstance.on,

      addRecentPlayed (obj) {
        if (!this.recentPlayed) {
          this.recentPlayed = []
        }

        if (this.recentPlayed[0] && this.recentPlayed[0].id === obj.id) {
          return
        }

        if (this.recentPlayed.length > 1) {
          for (var i = 0; i < this.recentPlayed.length; i++) {
            if (this.recentPlayed[i].id === obj.id) {
              this.recentPlayed.splice(i, 1)
              i--
            }
          }
        }

        this.recentPlayed.unshift(obj)

        if (this.recentPlayed.length > 12) {
          this.recentPlayed.splice(this.recentPlayed.length - 1, 1)
        }

        localStorage.setItem(
          'LLCT.RecentPlayed',
          JSON.stringify(this.recentPlayed)
        )
      }
    }
  })

  window.addEventListener('load', () => {
    dataInstance.songs()
    dataInstance.recommended()
    dataInstance.defaultPlaylist()

    dataInstance.loadRecent()
  })
})()

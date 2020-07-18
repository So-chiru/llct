import Vue from 'vue'
import { store } from '../store/index'

import * as Toast from '../components/toast'
import * as Playlist from './playlist'
import settings from './settings'

// from https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/string/longest-common-substring/longestCommonSubstring.js
const LCS = (string1, string2) => {
  const s1 = [...string1]
  const s2 = [...string2]

  const substringMatrix = Array(s2.length + 1)
    .fill(null)
    .map(() => {
      return Array(s1.length + 1).fill(null)
    })

  for (let columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
    substringMatrix[0][columnIndex] = 0
  }

  for (let rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
    substringMatrix[rowIndex][0] = 0
  }

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

      if (substringMatrix[rowIndex][columnIndex] > longestSubstringLength) {
        longestSubstringLength = substringMatrix[rowIndex][columnIndex]
        longestSubstringColumn = columnIndex
        longestSubstringRow = rowIndex
      }
    }
  }

  if (longestSubstringLength === 0) {
    return ''
  }

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

const host =
  window.location.hostname.indexOf('lovelivec.kr') === -1
    ? 'http://' + window.location.hostname + ':10210'
    : 'https://api.lovelivec.kr'

const dataFetch = {
  karaoke: id =>
    new Promise((resolve, reject) =>
      fetch(`${host}/call/${id}`)
        .then(v => {
          if (!v.ok) {
            reject(`${v.status} ${v.statusText}`)
          }

          return v.json()
        })
        .then(v => resolve(v))
        .catch(e => {
          reject(e)
        })
    ),
  lists: () =>
    new Promise((resolve, reject) =>
      fetch(`${host}/lists`)
        .then(v => {
          if (!v.ok) {
            reject(`${v.status} ${v.statusText}`)
          }

          return v.json()
        })
        .then(v => resolve(v))
        .catch(e => {
          reject(e)
        })
    ),
  playlists: () =>
    new Promise((resolve, reject) =>
      fetch(`${host}/playlists`)
        .then(v => {
          if (!v.ok) {
            reject(`${v.status} ${v.statusText}`)
          }

          return v.json()
        })
        .then(v => resolve(v))
        .catch(e => {
          reject(e)
        })
    ),
  recommends: () =>
    new Promise((resolve, reject) =>
      fetch(`${host}/recommend`)
        .then(v => {
          if (!v.ok) {
            reject(`${v.status} ${v.statusText}`)
          }

          return v.json()
        })
        .then(v => resolve(v))
        .catch(e => {
          reject(e)
        })
    )
}

;(() => {
  let $llctDatas = new Vue({
    data () {
      return {
        base: host,
        useImages: settings.get('useImages'),
        useTranslatedTitle: settings.get('useTranslatedTitle')
      }
    },
    store,
    methods: {
      refresh () {
        this.dataHandle('recommends', dataFetch.recommends())
      },
      artist (id, artist) {
        let first = id.substring(0, 1)
        let group = this.groups[first]

        return group && this.$store.state.data.lists[group]
          ? this.$store.state.data.lists[group].meta.artists[artist || 0] ||
              artist ||
              0
          : null
      },

      getSong (id) {
        let first = id.substring(0, 1)
        let group = this.groups[first]

        let meta = this.$store.state.data.lists[group].collection

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

        for (var i = 0; i < this.groups.length; i++) {
          musics.push(
            ...this.$store.state.data.lists[this.groups[i]].collection
          )
        }

        let musicsLen = musics.length
        for (var i = 0; i < musicsLen; i++) {
          let music = musics[i]

          let ga = this.artist(music.id, music.artist)

          let searchStr = `${music.title}-${music.tr ? music.tr + '-' : ''}${
            music.sk ? music.sk + '-' : ''
          }${music.tags ? music.tags.join('-') + '.' : ''}-${ga}`
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
        return this.getSong(id).ka && !useImg ? dataFetch.karaoke(id) : 'img'
      },

      async dataHandle (name, pm, afterCb) {
        try {
          let data = await pm
          this.$store.commit(`data/${name}`, data)

          if (typeof afterCb === 'function') {
            afterCb(data)
          }
        } catch (e) {
          Toast.show(
            'API 서버에 연결할 수 없습니다. ' + e.message,
            'warning',
            true,
            10000
          )
        }
      }
    }
  })

  Vue.prototype.$llctDatas = $llctDatas

  window.addEventListener('load', () => {
    $llctDatas.dataHandle('lists', dataFetch.lists(), data => {
      $llctDatas.$emit('listsLoaded', data)
      $llctDatas.groups = Object.keys(data)
    })
    $llctDatas.dataHandle('recommends', dataFetch.recommends(), data => {
      if (data.Notices && data.Notices.Msg.length) {
        Toast.show(
          data.Notices.Msg,
          data.Notices.Icon,
          data.Notices.Type,
          data.Notices.Time
        )
      }
    })
    $llctDatas.dataHandle('playlists', dataFetch.playlists(), data => {
      if (!data.lists) {
        return false
      }

      $llctDatas.$store.commit('data/playlistsHolder', new Playlist.Holder())

      let preData = JSON.parse(localStorage.getItem('LLCTPlaylist') || '[]')

      let len = preData.length
      if (len) {
        for (var i = 0; i < len; i++) {
          let pred = preData[i]
          let pl = new Playlist.LLCTPlaylist()

          pl.import(pred)
          $llctDatas.$store.state.data.playlistsHolder.add(pl, true)
        }
      }

      let listsLen = data.lists.length
      for (var i = 0; i < listsLen; i++) {
        let list = data.lists[i]

        let pl = new Playlist.LLCTPlaylist(list.Title, true)

        list.spoiler = list.Spoiler || false
        list.lists = list.Items

        delete list.Title
        delete list.Items

        pl.import(list)
        $llctDatas.$store.state.data.playlistsHolder.add(pl, true)
      }
    })
  })
})()

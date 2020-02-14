// DeepCopy code by c7x43t https://github.com/c7x43t
const deepCopy = o => {
  if (typeof o !== 'object' || o === null) return o
  let newO, i
  if (o instanceof Array) {
    let l
    newO = []
    for (i = 0, l = o.length; i < l; i++) newO[i] = deepCopy(o[i])
    return newO
  }
  newO = {}
  for (i in o) if (o.hasOwnProperty(i)) newO[i] = deepCopy(o[i])
  return newO
}

class LLCTPlaylist {
  constructor (title, readOnly) {
    this.__pointer = null
    this.lists = []
    this.title = title || null
    this.readOnly = readOnly || false
  }

  add (item) {
    this.lists.push(item)
  }

  import (obj) {
    let keys = Object.keys(obj)
    let keysIter = keys.length
    while (keysIter--) {
      if (keys[keysIter].indexOf('__') > -1) continue
      this[keys[keysIter]] = obj[keys[keysIter]]
    }
  }

  remove (index) {
    this.lists.splice(index, 1)
  }

  next () {
    if (this.__pointer != null) {
      this.__pointer =
        this.__pointer + 1 == this.lists.length ? 0 : this.__pointer + 1
      return this.lists[this.__pointer]
    } else {
      this.__pointer = 1
      return this.lists[1]
    }
  }

  prev () {
    if (this.__pointer != null) {
      this.__pointer =
        this.__pointer - 1 < 0 ? this.lists.length - 1 : this.__pointer - 1
      return this.lists[this.__pointer]
    } else {
      this.__pointer = this.lists.length - 1
      return this.lists[this.lists.length - 1]
    }
  }

  isEnd () {
    return this.__pointer + 1 >= this.lists.length
  }
}

class PlaylistHolder {
  constructor () {
    this.lists = []
  }

  add (item, skipSave) {
    let pos = this.lists.push(item)
    if (!skipSave) this.save()

    return pos
  }

  addSong (pos, item) {
    if (!this.lists[pos]) {
      throw new Error('Given position is not defined.')
    }

    this.lists[pos].lists.push(item)
    this.save()
  }

  find (title, indexOnly) {
    let listsIter = this.lists.length
    while (listsIter--) {
      if (this.lists[listsIter].title === title)
        return indexOnly ? listsIter : this.lists[listsIter]
    }
  }

  remove (item) {
    if (typeof item === 'number') {
      this.lists.splice(item, 1)
    }

    let listIter = this.lists.length
    while (listIter--) {
      if (this.lists[listIter] === item) {
        this.lists.splice(listIter, 1)
        return
      }
    }

    this.save()
  }

  save () {
    let lis = []

    let thisLen = this.length()
    for (var i = 0; i < thisLen; i++) {
      let item = deepCopy(this.lists[i])

      if (item.readOnly) continue

      /*let lisLen = item.lists.length
      for (var z = 0; z < lisLen; z++) {
        item.lists[z] = item.lists[z].id
      }*/

      lis.push(item)
    }

    localStorage.setItem('LLCTPlaylist', JSON.stringify(lis))
  }

  length () {
    return this.lists.length
  }
}

window.addEventListener('playlistReceive', ev => {
  if (!ev.detail || !ev.detail.data.lists) {
    return false
  }

  window.playlists = new PlaylistHolder()

  let preData = JSON.parse(localStorage.getItem('LLCTPlaylist') || '[]')

  let len = preData.length
  if (len) {
    for (var i = 0; i < len; i++) {
      let data = preData[i]
      let pl = new LLCTPlaylist()

      /*for (var z = 0; z < data.lists.length; z++) {
        let id = data.lists[z]

        let song = ev.detail.getSong(id)
        data.lists[z] = song
      }*/

      pl.import(data)
      playlists.add(pl, true)
    }
  }

  let listsLen = ev.detail.data.lists.length
  for (var i = 0; i < listsLen; i++) {
    let list = ev.detail.data.lists[i]

    let pl = new LLCTPlaylist(list.Title, true)

    list.lists = list.Items
    pl.import(list)
    playlists.add(pl, true)
  }

  window.dispatchEvent(
    new CustomEvent('renderPlaylist', {
      detail: { playlists }
    })
  )
})

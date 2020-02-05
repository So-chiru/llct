class LLCTPlaylist {
  constructor (title, readOnly) {
    this.__pointer = null
    this.lists = []
    this.title = title || null
    this.readOnly = readOnly || false

    this.nextFunc = () => {}
    this.prevFunc = () => {}
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
}

class PlaylistHolder {
  constructor () {
    this.lists = []
  }

  add (item) {
    let pos = this.lists.push(item)
    this.save()

    return pos
  }

  addSong (pos, item) {
    if (!this.lists[pos]) {
      throw new Error('Given position is not defined.')
    }

    this.lists[pos].lists.push(item)
    this.save()
  }

  find (title) {
    let listsIter = this.lists.length
    while (listsIter--) {
      if (this.lists[listsIter].title === title) return this.lists[listsIter]
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
    for (var i = 0; i < this.length(); i++) {
      let item = this.lists[i]

      if (!item.readOnly) lis.push(item)
    }

    localStorage.setItem('LLCTPlaylist', JSON.stringify(lis))
  }

  length () {
    return this.lists.length
  }
}

window.addEventListener('playlistReceive', ev => {
  if (!ev.detail || !ev.detail.lists) {
    return false
  }

  window.playlists = new PlaylistHolder()

  let preData = JSON.parse(localStorage.getItem('LLCTPlaylist') || '[]')

  let len = preData.length
  if (len) {
    for (var i = 0; i < len; i++) {
      let data = preData[i]
      let pl = new LLCTPlaylist()
      pl.import(data)

      playlists.add(pl)
    }
  }

  let listsLen = ev.detail.lists.length
  for (var i = 0; i < listsLen; i++) {
    let list = ev.detail.lists[i]

    let pl = new LLCTPlaylist(list.Title, true)

    playlists.add(pl)
  }
})

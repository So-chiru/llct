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

interface LLCTMusic {
  title: String
  lists: Array<any>
}

export class LLCTPlaylist {
  __pointer: number
  lists: Array<Object>
  title: String
  readOnly: Boolean
  repeat: Boolean

  constructor (title, readOnly) {
    this.__pointer = null
    this.lists = []
    this.title = title || null
    this.readOnly = readOnly || false
    this.repeat = Boolean(localStorage.getItem('LLCT.Audio.RepeatPlaylist'))
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

  first () {
    this.__pointer = 0
    return this.lists[0]
  }

  last () {
    this.__pointer = this.lists.length - 1
    return this.lists[this.lists.length - 1]
  }

  next () {
    if (this.__pointer != null) {
      this.__pointer =
        this.__pointer + 1 == this.lists.length ? 0 : this.__pointer + 1
      return this.lists[this.__pointer]
    }

    this.__pointer = 1
    return this.lists[1]
  }

  prev () {
    if (this.__pointer != null) {
      this.__pointer =
        this.__pointer - 1 < 0 ? this.lists.length - 1 : this.__pointer - 1
      return this.lists[this.__pointer]
    }

    return this.last()
  }

  isEnd () {
    return this.__pointer + 1 >= this.lists.length
  }
}

export class Holder {
  lists: Array<LLCTMusic>

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

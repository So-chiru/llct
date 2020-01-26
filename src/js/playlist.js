/**
 * Playlist.js
 */

class Playlist {
  constructor () {
    this.pointer = null
    this.lists = []

    this.onlyRead = false

    this.nextFunc = () => {}
    this.prevFunc = () => { }
  }
}

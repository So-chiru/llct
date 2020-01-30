class LLCTPlaylist {
  constructor () {
    this.pointer = null
    this.lists = []

    this.onlyRead = false

    this.nextFunc = () => {}
    this.prevFunc = () => { }
  }
}

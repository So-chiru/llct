const LLCTData = class {
  constructor (base) {
    if (!base) {
      base = '/'
    }

    this.base = base
  }

  get songLists () {
    return new Promise((resolve, reject) => {
      fetch(base + 'data')
        .then(res => {
          resolve(res.json())
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  get recommended () {
    return new Promise((resolve, reject) => {
      fetch(base + 'recommend')
        .then(res => {
          resolve(res.json())
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

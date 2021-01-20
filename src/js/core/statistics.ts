import settings from './settings'

let start = Date.now()
let got = ''

let playedList: string[] = []

export const send = (id: string) => {
  if (!id) {
    return
  }
  
  let allowStatistics = settings.get('sendStatistics')

  playedList.push(id)

  if (allowStatistics) {
    fetch('https://statistics-api.sochiru.workers.dev/update', {
      method: 'POST',
      body: JSON.stringify({
        id: playedList,
        last: Date.now() - start,
        uuid: got || null
      })
    })
      .then(v => {
        return v.text()
      })
      .then(v => {
        if (v) {
          got = v
        }
      })
  }
}

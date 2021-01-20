import settings from './settings'

let start = Date.now()
export const send = (id: string) => {
  let allowStatistics = settings.get('sendStatistics')

  if (allowStatistics) {
    fetch('https://statistics-api.sochiru.workers.dev/update', {
      method: 'POST',
      body: JSON.stringify({
        id,
        last: Date.now() - start
      })
    })
  }
}

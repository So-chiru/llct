const makeItJSON = (result: Response) => result.json()

export const fetchAPI = async () => {
  return fetch(`${process.env.API_SERVER}/lists`)
    .then(makeItJSON)
    .then(p => {
      if (!p.result || p.result === 'error') {
        throw new Error(p.data || '서버에서 오류를 반환하였습니다.')
      }

      return p.data
    })
}

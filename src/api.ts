const makeItJSON = (result: Response) => result.json()

export const fetchAPI = async () => {
  return fetch('http://localhost:10210/lists').then(makeItJSON)
}

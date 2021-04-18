import { RGBtoHex } from './styles/colors'

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

export const fetchCallData = async (id: string): Promise<LLCTCall> => {
  return fetch(`${process.env.API_SERVER}/call/${id}`)
    .then(v => {
      if (v.status === 404) {
        throw new Error('콜표가 없어요.')
      }

      if (v.status > 500) {
        throw new Error('서버 오류로 콜표를 불러올 수 없어요.')
      }

      return v
    })
    .then(makeItJSON)
}

export const fetchColorData = async (id: string): Promise<LLCTColor> => {
  return fetch(`${process.env.API_SERVER}/color/${id}`)
    .then(v => {
      if (v.status === 404) {
        throw new Error('이미지가 없어요.')
      }

      if (v.status > 500) {
        throw new Error('서버 오류로 이미지를 불러올 수 없어요.')
      }

      return v
    })
    .then(makeItJSON)
    .then(v => {
      if (!v.result || v.result === 'error') {
        throw new Error(v.data || '서버에서 오류를 반환하였습니다.')
      }
      return v.data
    })
}

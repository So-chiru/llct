const makeItJSON = (result: Response) => result.json()

export const fetchAPI = async () => {
  return fetch(`${process.env.API_SERVER}/lists`)
    .then(v => {
      if (v.status === 404) {
        throw new Error('노래 목록이 없어요.')
      }

      if (v.status === 530) {
        throw new Error('연결할 수 없어요. 인터넷 연결을 확인해보세요.')
      }

      if (v.status >= 500) {
        throw new Error('서버 오류로 노래 목록을 불러올 수 없어요.')
      }

      return v
    })
    .then(makeItJSON)
    .then(p => {
      if (!p.result || p.result === 'error') {
        throw new Error(p.data || '연결 도중에 오류를 반환하였습니다.')
      }

      return p.data
    })
    .catch(e => {
      if (e.message === 'Failed to fetch') {
        throw new Error('연결 오류로 노래 목록을 불러올 수 없어요.')
      }

      throw e
    })
}

export const fetchCallData = async (id: string): Promise<LLCTCall> => {
  return fetch(`${process.env.API_SERVER}/call/${id}`)
    .then(v => {
      if (v.status === 404) {
        throw new Error('콜표가 없어요.')
      }

      if (v.status === 530) {
        throw new Error('연결할 수 없어요. 인터넷 연결을 확인해보세요.')
      }

      if (v.status >= 500) {
        throw new Error('서버 오류로 콜표를 불러올 수 없어요.')
      }

      return v
    })
    .then(makeItJSON)
    .catch(e => {
      if (e.message === 'Failed to fetch') {
        throw new Error('연결 오류로 콜표를 불러올 수 없어요.')
      }

      throw e
    })
}

export const fetchServerPlaylist = async (): Promise<LLCTPlaylistDataV1> => {
  return fetch(`${process.env.API_SERVER}/playlists`)
    .then(v => {
      if (v.status === 404) {
        throw new Error('플레이리스트가 없어요.')
      }

      if (v.status === 530) {
        throw new Error('연결할 수 없어요. 인터넷 연결을 확인해보세요.')
      }

      if (v.status >= 500) {
        throw new Error('서버 오류로 플레이리스트를 불러올 수 없어요.')
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
    .catch(e => {
      if (e.message === 'Failed to fetch') {
        throw new Error('연결 오류로 플레이리스트를 불러올 수 없어요.')
      }

      throw e
    })
}


export const fetchUpdates = async (): Promise<LLCTUpdate> => {
  return fetch(`${process.env.API_SERVER}/updates`)
    .then(v => {
      if (v.status === 404) {
        throw new Error('업데이트 목록이 없어요.')
      }

      if (v.status === 530) {
        throw new Error('연결할 수 없어요. 인터넷 연결을 확인해보세요.')
      }

      if (v.status >= 500) {
        throw new Error('서버 오류로 업데이트 목록을 불러올 수 없어요.')
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
    .catch(e => {
      if (e.message === 'Failed to fetch') {
        throw new Error('연결 오류로 업데이트 목록을 불러올 수 없어요.')
      }

      throw e
    })
}

export const fetchColorData = async (id: string): Promise<LLCTColorV2> => {
  const headers = new Headers()
  headers.set('LLCT-Api-Version', '2')

  return fetch(`${process.env.API_SERVER}/color/${id}`, {
    headers,
  })
    .then(v => {
      if (v.status === 404) {
        throw new Error('곡 색상 정보가 없어요.')
      }

      if (v.status === 530) {
        throw new Error('연결할 수 없어요. 인터넷 연결을 확인해보세요.')
      }

      if (v.status >= 500) {
        throw new Error('서버 오류로 곡 색상 정보를 불러올 수 없어요.')
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
    .catch(e => {
      if (e.message === 'Failed to fetch') {
        throw new Error('연결 오류로 곡 색상 정보를 불러올 수 없어요.')
      }

      throw e
    })
}

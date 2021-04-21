import { useSelector, useDispatch } from 'react-redux'

import { RootState } from '@/store/index'

const DataLoaderContainer = () => {
  const songs = useSelector((state: RootState) => state.songs)

  // dispatch를 사용할 수 있게 해주는 함수: useDispatch
  const dispatch = useDispatch()

  // API 서버에서 데이터를 가져오는 함수를 호출합니다.
  const fetchAPI = () => {
    dispatch({ type: '@llct/api_lists/request' })
  }

  if (!songs || !songs.load) {
    fetchAPI()
  }

  return null
}

export default DataLoaderContainer

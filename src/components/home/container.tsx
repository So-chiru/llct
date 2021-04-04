import Home from './component'

import { useSelector, useDispatch } from 'react-redux'

import { RootState } from '@/store/index'

const HomeContainer = () => {
  // state를 가져오는 react-redux 함수: useSelector
  const songs = useSelector((state: RootState) => state.songs)

  const currentTab = useSelector((state: RootState) => state.ui.currentTab)
  const tabs = useSelector((state: RootState) => state.ui.tabs)

  // dispatch를 사용할 수 있게 해주는 함수: useDispatch
  const dispatch = useDispatch()

  // API 서버에서 데이터를 가져오는 함수를 호출합니다.
  const fetchAPI = () => {
    dispatch({ type: '@llct/api_lists/request' })
  }

  if (!songs || !songs.load) {
    fetchAPI()
  }

  console.log(songs)

  return <Home tabs={tabs} currentTab={currentTab}></Home>
}

export default HomeContainer

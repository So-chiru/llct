import Home from './component'

import { useSelector } from 'react-redux'

import { RootState } from '@/store/index'

const HomeContainer = () => {
  const currentTab = useSelector((state: RootState) => state.ui.currentTab)
  const tabs = useSelector((state: RootState) => state.ui.tabs)

  return <Home tabs={tabs} currentTab={currentTab}></Home>
}

export default HomeContainer

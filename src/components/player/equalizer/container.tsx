import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import EqualizerComponent from './component'

const EqualizerContainer = () => {
  const instance = useSelector((state: RootState) => state.playing.instance)

  if (!instance || !instance.supportEffects) {
    return (
      <div className='no-eq-support'>
        현재 선택된 오디오 스택은 음향 효과를 지원하지 않습니다.
      </div>
    )
  }

  return (
    <EqualizerComponent effects={instance.supportEffects}></EqualizerComponent>
  )
}

export default EqualizerContainer

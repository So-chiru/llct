import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import UpNextComponent from './component'

import { play } from '@/store/player/actions'

const UpNextContainer = () => {
  const dispatch = useDispatch()

  const instance = useSelector((state: RootState) => state.playing.instance)
  const queue = useSelector((state: RootState) => state.playing.queue)
  const pointer = useSelector((state: RootState) => state.playing.pointer)

  const onClick = (current: boolean, pointer: number) => {
    if (current) {
      return
    }

    dispatch(play(null, pointer))

    if (instance) {
      // dispatch된 직후 context에서 바로 재생하면 바뀌기 전 노래가 재생되니 rAF 사용
      requestAnimationFrame(() => {
        instance.play()
      })
    }
  }

  return (
    <div className='llct-upnext'>
      {queue.length ? (
        queue.map((value, index) => {
          return (
            <UpNextComponent
              key={index + value.id}
              music={value}
              current={pointer === index}
              index={index}
              click={onClick}
            ></UpNextComponent>
          )
        })
      ) : (
        <p className='queue-empty-text'>대기열에 있는 노래가 없습니다.</p>
      )}
    </div>
  )
}

export default UpNextContainer

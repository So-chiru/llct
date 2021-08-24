import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import UpNextComponent from './component'

import { play, playPlaylist } from '@/store/player/actions'

const UpNextContainer = () => {
  const dispatch = useDispatch()

  const instance = useSelector((state: RootState) => state.playing.instance)
  const queue = useSelector((state: RootState) => state.playing.queue)
  const mode = useSelector((state: RootState) => state.playing.mode)
  const pointer = useSelector((state: RootState) => state.playing.pointer)

  const playlistQueue = useSelector(
    (state: RootState) => state.playing.playlist
  )
  const playlistPointer = useSelector(
    (state: RootState) => state.playing.playlistPointer
  )

  const onClick = (current: boolean, pointer: number, playlist?: boolean) => {
    if (current) {
      return
    }

    if (playlist) {
      dispatch(playPlaylist(null, pointer))
    } else {
      dispatch(play(null, pointer))
    }

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
        <div className='upnext-section'>
          <h1 className='column-title'>재생 대기열</h1>
          <div className='playlist-item-collection'>
            {queue.map((value, index) => {
              return (
                <UpNextComponent
                  key={index + value.id}
                  music={value}
                  current={mode === 'queue' && pointer === index}
                  index={index}
                  click={onClick}
                ></UpNextComponent>
              )
            })}
          </div>
        </div>
      ) : (
        <p className='queue-empty-text'>대기열에 있는 노래가 없습니다.</p>
      )}
      {playlistQueue && (
        <div className='upnext-section'>
          <h1 key='playlist-column-header' className='column-title'>
            {playlistQueue.title}
          </h1>
          <div className='playlist-item-collection'>
            {playlistQueue.items.map((value, index) => {
              return (
                <UpNextComponent
                  playlist={true}
                  key={index + value.id}
                  music={value}
                  current={mode === 'playlist' && playlistPointer === index}
                  index={index}
                  click={onClick}
                ></UpNextComponent>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default UpNextContainer

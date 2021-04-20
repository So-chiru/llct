import { RootState } from '@/store'
import '@/styles/components/player-button/player-button-cover.scss'

import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'

const PlayerAlbumCoverAnimationComponent = () => {
  const ref = useRef<HTMLDivElement>(null)
  const queue = useSelector((state: RootState) => state.playing.queue)
  const [lastCounts, setLastCounts] = useState<number>(0)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    ref.current.addEventListener('animationend', () => {
      ref.current?.classList.remove('show')
    })
  }, [ref.current])

  useEffect(() => {
    if (queue.length > lastCounts && ref.current) {
      if (ref.current.classList.contains('show')) {
        ref.current.classList.remove('show')
      }

      requestAnimationFrame(() => {
        ref.current!.classList.add('show')
      })
      setLastCounts(queue.length)
    }
  }, [queue, lastCounts])

  const item = queue.length ? queue[queue.length - 1] : undefined

  return (
    <div
      ref={ref}
      className={`llct-player-button-animation`}
      style={{
        ['--direction' as string]: Math.random() > 0.5 ? 1 : -1
      }}
    >
      <img src={item && item.image}></img>
    </div>
  )
}

export default PlayerAlbumCoverAnimationComponent

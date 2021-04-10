import '@/styles/components/progress-bar/progress-bar.scss'
import { useRef, useState } from 'react'

interface ProgressBarComponentProps {
  thumb?: boolean
  progress?: number
  listen?: () => number
  seek?: (seekTo: number) => void
}

const ProgressBarComponent = ({
  thumb,
  progress,
  listen,
  seek
}: ProgressBarComponentProps) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const [progressRect, updateProgressRect] = useState<DOMRect | boolean>()
  const [amf, setAmf] = useState<number>()
  const [listenerProgress, setListenerProgress] = useState<number>()

  const clickHandler = (ev: MouseEvent) => {
    if (!progressRef.current || !seek) {
      return
    }

    seek(ev.offsetX / progressRef.current.getBoundingClientRect().width)
  }

  if (progressRef.current) {
    if (typeof progressRect === 'undefined') {
      const update = () => {
        updateProgressRect(true)

        requestAnimationFrame(() => {
          const rect = progressRef.current?.getBoundingClientRect()
          updateProgressRect(rect)
        })
      }

      window.addEventListener('resize', update)
      progressRef.current.addEventListener('click', clickHandler)

      update()
    }

    /// 100ms 마다 업데이트하는 건 좀 그렇지 않은가?
    if (listen && !amf) {
      const update = () => {
        if (!progressRef.current) {
          return
        }

        setListenerProgress(listen())
        setAmf((setTimeout(update, 100) as unknown) as number)
      }

      update()
    } else if (!listen && amf) {
      clearTimeout(amf)
      setAmf(0)
    }
  }

  return (
    <div
      className='llct-progress-bar'
      style={{
        ['--progress' as string]: listenerProgress || progress?.toFixed(1)
      }}
      ref={progressRef}
    >
      {thumb && (
        <div
          className='thumb'
          style={{
            ['--translate' as string]:
              ((progressRect instanceof DOMRect && progressRect?.width) ||
                100) *
                (listenerProgress || progress || 0) +
              'px'
          }}
        ></div>
      )}
      <div className='progress'></div>
    </div>
  )
}

export default ProgressBarComponent

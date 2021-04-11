import '@/styles/components/progress-bar/progress-bar.scss'
import { useRef, useState, useEffect } from 'react'

interface ProgressBarComponentProps {
  thumb?: boolean
  progress?: number
  duration?: number
  listen?: () => number
  seek?: (seekTo: number) => void
}

const timeSerialize = (num: number): string =>
  new Date(num * 1000).toISOString().substr(14, 5)

const ProgressBarComponent = ({
  thumb,
  progress,
  duration,
  listen,
  seek
}: ProgressBarComponentProps) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const [progressRect, updateProgressRect] = useState<DOMRect | boolean>()
  const [amf, setAmf] = useState<number>()
  const [listenerProgress, setListenerProgress] = useState<number>()

  const seekWrapper = (seekTo: number) => {
    if (seek) {
      seek(seekTo)
    }

    setListenerProgress(seekTo)
  }

  const clickHandler = (ev: MouseEvent) => {
    if (!progressRef.current || !seek) {
      return
    }

    seekWrapper(ev.offsetX / progressRef.current.getBoundingClientRect().width)
  }

  const [seekControl, setSeekControl] = useState<number>(-1)

  if (progressRef.current) {
    if (typeof progressRect === 'undefined') {
      let pointerDown = false
      let internalRect = progressRef.current.getBoundingClientRect()

      const update = () => {
        updateProgressRect(true)

        requestAnimationFrame(() => {
          if (!progressRef.current) {
            return
          }

          const rect = progressRef.current.getBoundingClientRect()

          internalRect = rect

          updateProgressRect(rect)
        })
      }

      window.addEventListener('resize', update)

      if (progressRef.current.parentElement) {
        progressRef.current.parentElement.addEventListener(
          'click',
          clickHandler
        )

        const dragHandler = (ev: MouseEvent) => {
          ev.preventDefault()

          if (!progressRef.current || !seek) {
            return
          }

          if (ev.type === 'mousemove' && pointerDown) {
            setSeekControl(ev.offsetX / internalRect.width)
          } else if (ev.type === 'mousedown') {
            pointerDown = true
          } else if (
            ev.type === 'mouseup' ||
            (ev.type === 'mouseleave' && pointerDown)
          ) {
            pointerDown = false

            if (seekControl > -1) {
              seekWrapper(seekControl)
            }

            setSeekControl(-1)
          }
        }

        let lastTouchPosition = -1
        const touchHandler = (ev: TouchEvent) => {
          ev.preventDefault()

          if (!progressRef.current || !seek) {
            return
          }

          if (ev.type === 'touchmove' && pointerDown) {
            const pos =
              (ev.touches[0].pageX - internalRect.x) / internalRect.width
            setSeekControl(pos)

            lastTouchPosition = pos
          } else if (ev.type === 'touchstart') {
            const pos =
              (ev.touches[0].pageX - internalRect.x) / internalRect.width
            setSeekControl(pos)

            lastTouchPosition = pos

            pointerDown = true
          } else if (
            ev.type === 'touchend' ||
            (ev.type === 'touchcancel' && pointerDown)
          ) {
            pointerDown = false

            if (lastTouchPosition > -1) {
              seekWrapper(lastTouchPosition)
            }

            setSeekControl(-1)
          }
        }
        ;['mousedown', 'mousemove', 'mouseup', 'mouseleave'].map(field => {
          if (progressRef.current && progressRef.current.parentElement) {
            progressRef.current.parentElement.addEventListener(
              field,
              dragHandler as () => void
            )
          }
        })
        ;['touchstart', 'touchmove', 'touchend', 'touchcancel'].map(field => {
          if (progressRef.current && progressRef.current.parentElement) {
            progressRef.current.parentElement.addEventListener(
              field,
              touchHandler as () => void
            )
          }
        })
      }

      update()
    }

    /// 100ms 마다 업데이트하는 건 좀 그렇지 않은가?
    if (listen && !amf) {
      const update = () => {
        if (!progressRef.current) {
          return
        }

        if (seekControl < 0) {
          setListenerProgress(listen())
        }

        setAmf((setTimeout(update, 100) as unknown) as number)
      }

      update()
    } else if (!listen && amf) {
      clearTimeout(amf)
      setAmf(0)
    }
  }

  const chosenProgress =
    seekControl < 0 ? listenerProgress || progress || 0 : seekControl

  return (
    <div className='llct-progress-bar-wrapper'>
      <div className='progress-bar-text-wrapper'>
        <div className='progress-bar-current'>
          {timeSerialize((duration || 1) * chosenProgress)}
        </div>
        <div className='progress-bar-duration'>
          {timeSerialize(duration || 1)}
        </div>
      </div>

      <div
        className='llct-progress-bar'
        style={{
          ['--progress' as string]: chosenProgress.toFixed(2)
        }}
        ref={progressRef}
      >
        {thumb && (
          <div
            className='thumb'
            style={{
              ['--translate' as string]:
                (
                  ((progressRect instanceof DOMRect && progressRect?.width) ||
                    100) * chosenProgress
                ).toFixed(1) + 'px'
            }}
          ></div>
        )}
        <div className='progress'></div>
      </div>
    </div>
  )
}

export default ProgressBarComponent

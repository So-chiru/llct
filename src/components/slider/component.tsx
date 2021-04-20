import '@/styles/components/slider/slider.scss'

import { useEffect, useRef, useState } from 'react'

interface SliderComponentProps {
  onChange?: (seek: number) => void
  onSeek?: (seek: number) => void
  format?: (current: number) => string
  step?: number
  max: number
  defaults?: number
  color?: SliderColor
  tabIndex?: number
}

const SliderComponent = ({
  onChange,
  onSeek,
  format,
  step,
  max,
  defaults,
  color,
  tabIndex
}: SliderComponentProps) => {
  const [current, setCurrent] = useState<number>(0)
  const lastValue = useRef<number>(-1)

  const wrapper = useRef<HTMLDivElement>(null)

  let pointerDown = false

  useEffect(() => {
    if (!pointerDown && typeof defaults !== 'undefined') {
      setCurrent(defaults)
    }
  }, [defaults])

  const [localRect, setLocalRect] = useState<DOMRect>()
  let rect: DOMRect | null = null

  const updateRect = () => {
    if (wrapper.current) {
      rect = wrapper.current.getBoundingClientRect()
      setLocalRect(rect)
    }
  }

  const seek = (value: number) => {
    let normalizedValue = Math.max(0, Math.min(value, 1))

    if (step) {
      normalizedValue = Math.round(normalizedValue / step) * step
    }

    setCurrent(normalizedValue)
    lastValue.current = normalizedValue

    if (onSeek) {
      onSeek(normalizedValue)
    }
  }

  const change = () => {
    if (lastValue.current === -1) {
      return
    }

    if (onChange) {
      onChange(lastValue.current)
    }

    lastValue.current = -1
  }

  const mouseHandler = (ev: MouseEvent) => {
    if (ev.type === 'mousedown') {
      pointerDown = true

      updateRect()
      seek(ev.offsetX / rect!.width)
    } else if (ev.type === 'mouseup') {
      pointerDown = false
      change()
    } else if (ev.type === 'mouseleave' && pointerDown) {
      pointerDown = false
      change()
    } else if (ev.type === 'mousemove' && pointerDown) {
      seek(ev.offsetX / rect!.width)
    }
  }

  const resizeHandler = () => {
    updateRect()
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
  }, [])

  useEffect(() => {
    if (!wrapper.current) {
      return
    }

    updateRect()

    wrapper.current.addEventListener('mousedown', mouseHandler)
    wrapper.current.addEventListener('mouseup', mouseHandler)
    wrapper.current.addEventListener('mouseleave', mouseHandler)
    wrapper.current.addEventListener('mousemove', mouseHandler)
  }, [wrapper.current])

  const displayValue = lastValue.current > -1 ? lastValue.current : current

  return (
    <div
      className='llct-slider-wrapper'
      ref={wrapper}
      style={{
        ['--slider-background-color' as string]: color && color.background,
        ['--slider-thumb-color' as string]: color && color.thumb,
        ['--slider-track-color' as string]: color && color.track,
        ['--slider-background-color-dark' as string]:
          color && color.backgroundDark,
        ['--slider-thumb-color-dark' as string]: color && color.thumbDark,
        ['--slider-track-color-dark' as string]: color && color.trackDark
      }}
      tabIndex={tabIndex}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-orientation='horizontal'
    >
      <div className='llct-slider-text'>
        <span className='text-current'>
          {format ? format(displayValue * max) : displayValue * max}
        </span>
        <span className='text-max'>{format ? format(max) : max}</span>
      </div>
      <div className='llct-slider'>
        <div
          className='thumb'
          aria-label={`현재 ${displayValue} 값임. (전체의 ${((displayValue / max) * 100).toFixed(2)}%)`}
          style={{
            ['--translate' as string]:
              (
                ((localRect && (localRect as DOMRect).width) || 100) *
                displayValue
              ).toFixed(1) + 'px'
          }}
        ></div>
        <div
          className='running-track'
          style={{
            ['--progress' as string]: displayValue
          }}
        ></div>
      </div>
    </div>
  )
}

export default SliderComponent

import '@/styles/components/slider/slider.scss'

import { useEffect, useRef, useState } from 'react'

interface SliderComponentProps {
  /**
   * 값이 변경되었을 때 실행할 함수
   */
  onChange?: (seek: number) => void

  /**
   * 슬라이더를 훑어볼 때 실행할 함수
   */
  onSeek?: (seek: number) => void

  /**
   * 슬라이더의 텍스트 영역에서 보일 텍스트를 처리할 함수
   */
  format?: (current: number) => string

  /**
   * 0-1 사이의 단계 값
   */
  step?: number

  /**
   * 슬라이더의 텍스트 영역에 표시될 최대 값 (슬라이더 현재 값: 0-1 사이의 현재 값 * 이 값)
   */
  max: number

  /**
   * 0-1 사이의 기본 값. (슬라이더 기준)
   */
  defaults?: number

  /**
   * 슬라이더의 색상
   */
  color?: SliderColor
  tabIndex?: number
}

const useResize = (onResize: () => void) => {
  useEffect(() => {
    const resizeHandler = () => {
      onResize()
    }

    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])
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

  const [rect, setRect] = useState<DOMRect>()

  const updateRect = () => {
    setRect(wrapper.current!.getBoundingClientRect())
  }
  useResize(updateRect)

  const seek = (value: number) => {
    let normalizedValue = Math.max(0, Math.min(value, 1))

    if (step) {
      const n = normalizedValue % step
      normalizedValue = normalizedValue - (n > step / 2 ? -(step - n) : n)
    }

    setCurrent(normalizedValue)
    lastValue.current = normalizedValue
    updateDisplayValue()

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

      window.addEventListener('mouseup', globalMouseHandler)
      window.addEventListener('mousemove', globalMouseHandler)
    }
  }

  const globalMouseHandler = (ev: MouseEvent) => {
    if (ev.type === 'mouseup') {
      pointerDown = false
      change()

      destroyGlobalMouseHandler()
    } else if (ev.type === 'mousemove' && pointerDown) {
      seek(
        (Math.min(
          window.innerWidth - rect!.left,
          Math.max(rect!.left, ev.screenX)
        ) -
          rect!.left) /
          rect!.width
      )
    }
  }

  const destroyGlobalMouseHandler = () => {
    window.removeEventListener('mouseup', globalMouseHandler)
    window.removeEventListener('mousemove', globalMouseHandler)
  }

  useEffect(() => {
    if (!wrapper.current) {
      return
    }

    if (!rect) updateRect()

    wrapper.current.addEventListener('mousedown', mouseHandler)

    return () => {
      wrapper.current?.removeEventListener('mousedown', mouseHandler)
      destroyGlobalMouseHandler()
    }
  }, [wrapper.current, rect])

  const getThumbPosition = (value: number) => {
    return ((rect?.width || 100) * value).toFixed(1)
  }

  const updateDisplayValue = () => {
    const displayValue = lastValue.current > -1 ? lastValue.current : current

    wrapper.current!.querySelector('.text-current')!.innerHTML = (format
      ? format(displayValue * max)
      : displayValue * max
    ).toString()
    ;(wrapper.current!.querySelector(
      '.running-track'
    )! as HTMLElement).setAttribute('style', `--progress:${displayValue}`)
    ;(wrapper.current!.querySelector('.thumb')! as HTMLElement).setAttribute(
      'style',
      `--translate:${getThumbPosition(displayValue)}px`
    )
  }

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
      role='slider'
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
          aria-label={`현재 ${displayValue} 값임. (전체의 ${(
            (displayValue / max) *
            100
          ).toFixed(2)}%)`}
          style={{
            ['--translate' as string]: getThumbPosition(displayValue) + 'px'
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

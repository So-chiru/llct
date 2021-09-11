import TouchSlider, { TouchDirection } from '@/core/ui/touch_slide'
import { useState } from 'react'
import { useEffect } from 'react'

export const useTouchSlider = (
  target: HTMLElement,
  player: HTMLElement,
  over: () => void
) => {
  const [touchHandler, setTouchHandler] = useState<TouchSlider>()

  useEffect(() => {
    if (!target || !player) {
      return
    }

    let slider: TouchSlider

    if (!touchHandler) {
      slider = new TouchSlider(target, {
        direction: TouchDirection.Vertical,
      })

      slider.events.on('start', () => {
        player.classList.add('player-handle-touch')
      })

      slider.events.on('move', (px: number) => {
        requestAnimationFrame(() => {
          player.style.setProperty('--player-pull', `${Math.max(-50, px)}px`)
        })
      })

      slider.events.on('end', (thresholdOver: boolean) => {
        player.classList.remove('player-handle-touch')

        requestAnimationFrame(() => {
          player.style.removeProperty('--player-pull')
        })

        if (thresholdOver) {
          over()
        }
      })

      setTouchHandler(slider)
      return
    }

    return () => {
      if (slider) {
        slider.destroy()
      }
    }
  }, [target, player])

  return undefined
}

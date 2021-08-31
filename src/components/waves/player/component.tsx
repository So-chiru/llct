import { MusicPlayerState } from '@/@types/state'
import { useState, useRef, useEffect } from 'react'

import PlayerWave from './animate'

interface PlayerWaveProps {
  progress: () => number
  show?: boolean
  color?: string
  state: MusicPlayerState
}

const UPDATE_RATE = 250

const PlayerWaveComponent = ({
  progress,
  show,
  color,
  state: playerState
}: PlayerWaveProps) => {
  const [wave, setWave] = useState<PlayerWave>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!show) {
      return
    }

    if (show && playerState === MusicPlayerState.Playing) {
      const update = () => {
        if (wave) {
          wave.updateProgress(progress())
        }
      }
      update()

      const interval = setInterval(update, UPDATE_RATE)
      return () => {
        clearInterval(interval)
      }
    }
  }, [progress, show, wave])

  if (canvasRef.current && !wave) {
    setWave(new PlayerWave(canvasRef.current, 100, 100))
  }

  if (wave) {
    wave.updateProgress(progress() ?? 0)
    wave.state = playerState
    if (color) {
      wave.color = color
    }

    requestAnimationFrame(() => {
      if (!show) {
        wave.stop()
        return
      }

      wave.start()
    })
  }

  return (
    <div className='llct-player-wave' data-show={show}>
      <canvas ref={canvasRef} width='100' height='100'></canvas>
    </div>
  )
}

export default PlayerWaveComponent

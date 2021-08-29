import { MusicPlayerState } from '@/@types/state'
import { useState, useRef, useEffect } from 'react'

import PlayerWave from './animate'

interface PlayerWaveProps {
  progress?: number
  show?: boolean
  color?: string
  seed?: number
  state: MusicPlayerState
  listener?: () => number
}

interface PlayerWaveStates {
  wave?: PlayerWave
}

const UPDATE_RATE = 250

const PlayerWaveComponent = ({
  progress,
  show,
  color,
  listener,
  state: playerState
}: PlayerWaveProps) => {
  const [state, setState] = useState<PlayerWaveStates>({} as PlayerWaveStates)
  const [seed, _] = useState<number>(Math.random() * 10000 - 5000)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const listenerRaf = useRef<number>(0)
  useEffect(() => {
    if (
      listener &&
      !listenerRaf.current &&
      show &&
      playerState === MusicPlayerState.Playing
    ) {
      const update = () => {
        if (state.wave) {
          state.wave.updateProgress(listener())
        }
      }

      update()
      listenerRaf.current = (setInterval(
        update,
        UPDATE_RATE
      ) as unknown) as number
    }

    if (!show && listenerRaf.current) {
      clearInterval(listenerRaf.current)
      listenerRaf.current = 0
    }
  }, [listener, show])

  requestAnimationFrame(() => {
    if (canvasRef.current && !state.wave) {
      const wave = new PlayerWave(canvasRef.current, 100, 100, seed)

      setState(prevState => ({
        ...prevState,
        wave
      }))

      if (show) {
        wave.start()
      }
    }

    if (state.wave) {
      state.wave.updateProgress(progress || 0)

      state.wave.state = playerState

      // 플레이어 버튼이 표시된 경우 파도 시작
      if (show && !state.wave.started) {
        state.wave.start()
      } else if (state.wave.started) {
        state.wave.stop()
      }

      if (color) {
        state.wave.color = color
      }
    }
  })

  return (
    <div className='llct-player-wave' data-show={show}>
      <canvas ref={canvasRef} width='100' height='100'></canvas>
    </div>
  )
}

export default PlayerWaveComponent

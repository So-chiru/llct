import { MusicPlayerState } from '@/@types/state'
import { useState, useRef } from 'react'

import PlayerWave from './animate'

interface PlayerWaveProps {
  progress: number
  show?: boolean
  state: MusicPlayerState
}

interface PlayerWaveStates {
  wave?: PlayerWave
}

const PlayerWaveComponent = ({
  progress,
  show,
  state: playerState
}: PlayerWaveProps) => {
  const [state, setState] = useState<PlayerWaveStates>({} as PlayerWaveStates)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  requestAnimationFrame(() => {
    if (canvasRef.current && !state.wave) {
      const wave = new PlayerWave(canvasRef.current, 100, 100)

      setState(prevState => ({
        ...prevState,
        wave
      }))

      if (show) {
        wave.start()
      }
    }

    if (state.wave) {
      state.wave.updateProgress(progress)

      // 플레이어 버튼이 표시된 경우 파도 시작
      if (show) {
        state.wave.start()
      } else {
        state.wave.stop()
      }

      state.wave.state = playerState
    }
  })

  return (
    <div className='llct-player-wave'>
      <canvas ref={canvasRef} width='100' height='100'></canvas>
    </div>
  )
}

export default PlayerWaveComponent

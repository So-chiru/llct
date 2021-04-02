import { useState, useRef } from 'react'

import PlayerWave from './animate'

interface PlayerWaveProps {
  progress: number
}

interface PlayerWaveStates {
  wave?: PlayerWave
}

const PlayerWaveComponent = ({ progress }: PlayerWaveProps) => {
  const [state, setState] = useState<PlayerWaveStates>({} as PlayerWaveStates)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  requestAnimationFrame(() => {
    if (canvasRef.current && !state.wave) {
      const wave = new PlayerWave(canvasRef.current, 100, 100)

      setState(prevState => ({
        ...prevState,
        wave
      }))

      wave.start()
    }

    if (state.wave) {
      state.wave.updateProgress(progress)
    }
  })

  return (
    <div className='llct-player-wave'>
      <canvas ref={canvasRef} width='100' height='100'></canvas>
    </div>
  )
}

export default PlayerWaveComponent

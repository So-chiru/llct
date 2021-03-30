import { useRef, useState } from 'react'
import Wave from './animate'

import '../../styles/components/waves/wave.scss'

interface WavesComponentState {
  wave?: Wave
}

const getProperWindowSize = (width: number, height: number) => {
  if (width < 600) {
    width = width / 1.2
  } else {
    width = Math.min(1000, Math.max(300, width / 2))
  }

  height = Math.min(600, Math.max(200, height / 2.5))

  return [width, height]
}

const WavesComponent = () => {
  const waveCanvas = useRef<HTMLCanvasElement>(null)

  const [state, setState] = useState({} as WavesComponentState)

  if (waveCanvas.current && !state.wave) {
    const properSize = getProperWindowSize(
      window.innerWidth,
      window.innerHeight
    )

    const wave = new Wave(waveCanvas.current, properSize[0], properSize[1])

    window.addEventListener('resize', () => {
      const properSize = getProperWindowSize(
        window.innerWidth,
        window.innerHeight
      )

      wave.resize(properSize[0], properSize[1])
    })

    setState(prevState => {
      return {
        ...prevState,
        wave
      }
    })

    wave.start()
  }

  return (
    <div className='waves'>
      <canvas ref={waveCanvas} className='wave-canvas'></canvas>
    </div>
  )
}

export default WavesComponent

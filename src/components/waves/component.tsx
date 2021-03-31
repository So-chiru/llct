import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Wave from './animate'

import '../../styles/components/waves/wave.scss'
import { RootState } from '@/store'

interface WavesComponentState {
  wave?: Wave
}

const getProperWindowSize = (width: number, height: number) => {
  if (width > 800) {
    width = Math.min(1000, Math.max(300, width / 1.5))
  }

  height = Math.min(600, Math.max(150, height / 3))

  return [width, height]
}

const WavesComponent = () => {
  const waveCanvas = useRef<HTMLCanvasElement>(null)

  const [state, setState] = useState({} as WavesComponentState)
  const darkTheme = useSelector((state: RootState) => state.ui.useDarkMode)

  requestAnimationFrame(() => {
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

    if (state.wave) {
      state.wave.updateTheme(darkTheme)
    }
  })

  return (
    <div className='waves'>
      <canvas ref={waveCanvas} className='wave-canvas'></canvas>
    </div>
  )
}

export default WavesComponent

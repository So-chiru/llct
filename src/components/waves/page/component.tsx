import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import PageWave from './animate'

import '@/styles/components/waves/wave.scss'
import { RootState } from '@/store'

interface PageWavesComponentState {
  wave?: PageWave
}

const getProperWindowSize = (width: number, height: number) => {
  if (width > 800) {
    width = Math.min(1000, Math.max(300, width / 1.5))
  }

  if (width > window.innerWidth) {
    width = window.innerWidth - 1
  }

  height = Math.min(600, Math.max(150, height / 3))

  return [width, height]
}

const WavesComponent = () => {
  const waveCanvas = useRef<HTMLCanvasElement>(null)

  const [state, setState] = useState({} as PageWavesComponentState)
  const darkTheme = useSelector((state: RootState) => state.ui.useDarkMode)
  const showPlayer = useSelector((state: RootState) => state.ui.player.show)

  requestAnimationFrame(() => {
    if (waveCanvas.current && !state.wave) {
      const properSize = getProperWindowSize(
        window.innerWidth,
        window.innerHeight
      )

      const wave = new PageWave(
        waveCanvas.current,
        properSize[0],
        properSize[1]
      )

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

      // 플레이어가 표시된 경우 페이지 상단 파도 멈춤
      if (showPlayer) {
        state.wave.stop()
      } else {
        state.wave.start()
      }
    }
  })

  return (
    <div className='waves'>
      <canvas ref={waveCanvas} className='wave-canvas'></canvas>
    </div>
  )
}

export default WavesComponent

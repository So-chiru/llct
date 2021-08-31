import { useRef, useState } from 'react'
import PageWave from './animate'

import '@/styles/components/waves/wave.scss'
import { useEffect } from 'react'

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

const WavesComponent = ({ dark, show }: { dark: boolean; show: boolean }) => {
  const waveCanvas = useRef<HTMLCanvasElement>(null)
  const [wave, setWave] = useState<PageWave>()

  useEffect(() => {
    if (wave || !waveCanvas.current) {
      return
    }

    const properSize = getProperWindowSize(
      window.innerWidth,
      window.innerHeight
    )

    const localWave = new PageWave(
      waveCanvas.current,
      properSize[0],
      properSize[1]
    )

    window.addEventListener('resize', () => {
      const properSize = getProperWindowSize(
        window.innerWidth,
        window.innerHeight
      )

      localWave.resize(properSize[0], properSize[1])
    })

    setWave(localWave)
  }, [waveCanvas.current, wave])

  requestAnimationFrame(() => {
    if (!wave) {
      return
    }

    wave.updateTheme(dark)

    if (!show) {
      wave.stop()
      return
    }

    wave.start()
  })

  return (
    <div className='waves'>
      <canvas ref={waveCanvas} className='wave-canvas'></canvas>
    </div>
  )
}

export default WavesComponent

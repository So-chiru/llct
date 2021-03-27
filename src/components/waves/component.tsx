import { useRef } from 'react'

const WavesComponent = () => {
  const waveCanvas = useRef(null)

  return (
    <div className='waves'>
      <canvas ref={waveCanvas}></canvas>
    </div>
  )
}

export default WavesComponent

import { useState } from 'react'
import SliderComponent from '../controls/slider/component'

interface ProgressBarComponentProps {
  progress: () => number
  duration: number
  update: boolean
  color?: SliderColor
  seek: (seekTo: number) => void
  tabIndex?: number
}

const timeSerialize = (num: number): string => {
  return new Date((num || 0) * 1000).toISOString().substr(14, 5)
}

const ProgressBarComponent = ({
  progress,
  duration,
  update,
  color,
  seek,
  tabIndex
}: ProgressBarComponentProps) => {
  const [seekProgress, setSeekProgress] = useState<number>()
  const [amf, setAmf] = useState<number>()

  // FIXME: 100ms 마다 업데이트하는 건 좀 그렇지 않은가?
  if (update && !amf) {
    const updateProgress = () => {
      setSeekProgress(progress())
    }

    setAmf((setInterval(updateProgress, 100) as unknown) as number)
    updateProgress()
  } else if (!update && amf) {
    clearInterval(amf)
    setAmf(0)
  }

  return (
    <SliderComponent
      max={duration}
      onChange={seek}
      color={color}
      format={timeSerialize}
      defaults={seekProgress}
      tabIndex={tabIndex}
    ></SliderComponent>
  )
}

export default ProgressBarComponent

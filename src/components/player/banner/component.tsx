import { RootState } from '@/store'
import { darken, lighten } from '@/styles/colors'
import '@/styles/components/player/banner.scss'
import React from 'react'
import { useSelector } from 'react-redux'

interface PlayerBannerComponentProps {
  title: string
  description: string
  color?: string
}

export const PlayerBannerComponent = ({
  title,
  description,
  color
}: PlayerBannerComponentProps) => {
  const darkMode = useSelector((state: RootState) => state.settings.useDarkMode)
    .value

  const colorStyle: React.CSSProperties = {}

  if (color) {
    const lightColor = lighten(color, 8)
    const darkenColor = darken(color, 8)

    if (darkMode) {
      colorStyle.background = darkenColor
      colorStyle.color = color
    } else {
      colorStyle.background = lightColor
      colorStyle.color = color
    }
  }

  return (
    <div className='llct-player-banner' style={colorStyle}>
      <div className='contents'>
        <h3 className='title'>{title}</h3>
        <h4 className='description'>{description}</h4>
      </div>
    </div>
  )
}

export default PlayerBannerComponent

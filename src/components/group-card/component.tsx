import React from 'react'

import { lighten } from '@/styles/colors'
import '@/styles/components/group-card/group-card.scss'

interface GroupCardProps {
  group: MusicGroupMetadata
  skeleton?: boolean
  active?: boolean
  index: number
  click: (index: number) => void
}

const GroupCardComponent = ({
  group,
  skeleton,
  active,
  index,
  click
}: GroupCardProps) => {
  return (
    <div
      className='group-card'
      data-active={active}
      data-skeleton={skeleton}
      style={{
        ['--group-color' as string]: group.color,
        ['--group-color-light' as string]: lighten(group.color, 0.9)
      }}
      onClick={() => click(index)}
    >
      <span className='text'>{group.name}</span>
    </div>
  )
}

export default GroupCardComponent

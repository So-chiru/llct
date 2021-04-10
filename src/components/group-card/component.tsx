import { lighten, darken } from '@/styles/colors'
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
        ['--group-color-light' as string]: lighten(group.color, 0.9),
        ['--group-color-dark' as string]: darken(group.color, 0.6),
        ['--group-color-dark-border' as string]: darken(group.color, 0.2)
      }}
      onClick={() => click(index)}
    >
      <span className='text'>{group.name}</span>
    </div>
  )
}

export default GroupCardComponent

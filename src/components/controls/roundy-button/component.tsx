import { ReactNode } from 'react'

import '@/styles/components/controls/roundy-button.scss'

interface RoundyButtonComponentProps {
  children: ReactNode
  onClick?: () => void
}

export const RoundyButtonComponent = ({
  children,
  onClick
}: RoundyButtonComponentProps) => {
  return (
    <div
      className='llct-roundy-button'
      role='button'
      onClick={() => onClick && onClick()}
    >
      <span className='contents'>{children}</span>
    </div>
  )
}

export default RoundyButtonComponent

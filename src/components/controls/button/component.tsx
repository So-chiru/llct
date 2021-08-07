import { ReactNode } from 'react'

import '@/styles/components/controls/button.scss'

interface ButtonComponentProps {
  children: ReactNode
  onClick?: () => void
}

export const ButtonComponent = ({
  children,
  onClick
}: ButtonComponentProps) => {
  return (
    <div className='llct-button' onClick={() => onClick && onClick()}>
      <span className='contents'>{children}</span>
    </div>
  )
}

export default ButtonComponent

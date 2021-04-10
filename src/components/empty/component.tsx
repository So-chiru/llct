import '@/styles/components/empty/empty.scss'

import { MdHourglassEmpty } from 'react-icons/md'

interface EmptyComponentProps {
  text: string
  height?: string
}

const EmptyComponent = ({ text, height }: EmptyComponentProps) => {
  return (
    <div className='llct-empty-placeholder' style={{ height: height }}>
      <div className='empty-wrapper'>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default EmptyComponent

import '@/styles/components/empty/empty.scss'

interface EmptyComponentProps {
  text: string
  height?: string
  children?: React.ReactNode
}

const EmptyComponent = ({ text, height, children }: EmptyComponentProps) => {
  return (
    <div className='llct-empty-placeholder' style={{ height: height }}>
      <div className='empty-wrapper'>
        <p>{text}</p>
        {
          children
        }
      </div>
    </div>
  )
}

export default EmptyComponent

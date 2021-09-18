interface WordComponentProps {
  start: number
  active: boolean
  passed: boolean
  text: string
  type?: number
  color?: string
  onClick?: (time: number) => void
  durationTime: () => string
}

export const WordComponent = ({
  start,
  active,
  passed,
  text,
  type,
  durationTime,
  color,
  onClick
}: WordComponentProps) => {
  return (
    <span
      className='llct-call-word'
      data-active={active}
      data-passed={passed}
      data-type={type}
      onClick={() => onClick && onClick(start)}
      style={{
        ['--text-color' as string]: color,
        transitionDuration: durationTime()
      }}
    >
      {text || <br></br>}
    </span>
  )
}

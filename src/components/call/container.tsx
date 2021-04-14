import { useMemo, useState } from 'react'

import '@/styles/components/call/call.scss'

interface CallContainerProps {
  data: LLCTCall
  listen: () => number | number
}

interface LineComponentProps {
  line: LLCTCallLine
  time: number
}

const LineComponent = ({ line, time }: LineComponentProps) => {
  const activeLine = line.start < time && line.end > time

  return (
    <p className='llct-call-line' data-active={activeLine}>
      {...line.words.map((word, i) => {
        const timeLessThanEnd = time < word.end
        const active = activeLine && time > word.start && timeLessThanEnd

        return (
          <span
            className='llct-call-word'
            key={`word:${i}`}
            data-active={active}
            data-passed={!timeLessThanEnd}
            data-type={word.type}
          >
            {word.text.length ? word.text : <br></br>}
          </span>
        )
      })}
    </p>
  )
}

const CallContainer = ({ data, listen }: CallContainerProps) => {
  const [amf, setAmf] = useState<number>(0)

  if (typeof listen === 'function' && amf == 0) {
    const update = () => {
      setAmf((requestAnimationFrame(update) as unknown) as number)
    }

    update()
  } else if (typeof listen !== 'function' && amf) {
    cancelAnimationFrame(amf)

    if (amf != 0) {
      setAmf(0)
    }
  }

  return (
    <div className='llct-call'>
      {...data.timeline.map((v, i) => {
        return (
          <LineComponent
            key={`line:${i}`}
            line={v}
            time={typeof listen === 'function' ? listen() : listen}
          ></LineComponent>
        )
      })}
    </div>
  )
}

export default CallContainer

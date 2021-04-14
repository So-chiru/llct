import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/components/call/call.scss'
import { RootState } from '@/store'
import * as callData from '@/store/call/actions'

interface CallContainerProps {
  current: () => number
  update: boolean
  id: string
}

interface LineComponentProps {
  line: LLCTCallLine
  index: number
  time: number
}

const LineComponent = ({ line, index, time }: LineComponentProps) => {
  const activeLine = line.start < time && line.end > time

  return (
    <p
      className='llct-call-line'
      key={`call-line:${index}:${activeLine}`}
      data-active={activeLine}
    >
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

const CallContainer = ({ update, current, id }: CallContainerProps) => {
  const call = useSelector((state: RootState) => state.call)
  const dispatch = useDispatch()

  const [amf, setAmf] = useState<number>(0)

  if (update && amf == 0) {
    const update = () => {
      setAmf((requestAnimationFrame(update) as unknown) as number)
    }

    update()
  } else if (!update && amf) {
    cancelAnimationFrame(amf)

    if (amf != 0) {
      setAmf(0)
    }
  }

  if (call.id !== id && id) {
    dispatch(callData.load(id))
  }

  // TODO : LoaderComponent로 대체
  if (!call.data) {
    return <p>Loading</p>
  }

  return (
    <div className='llct-call'>
      {...call.data.timeline.map((v, i) => {
        return (
          <LineComponent
            key={`line:${i}`}
            index={i}
            line={v}
            time={current()}
          ></LineComponent>
        )
      })}
    </div>
  )
}

export default CallContainer

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/components/call/call.scss'
import { RootState } from '@/store'
import * as callData from '@/store/call/actions'
import LoaderComponent from '../loader/component'
import EmptyComponent from '../empty/component'

interface CallContainerProps {
  current: () => number
  update: boolean
  id: string
  lastSeek: number
}

interface LineComponentProps {
  line: LLCTCallLine
  index: number
  time: number
  timeline: LLCTCall | null
}

interface WordComponentProps {
  active: boolean
  passed: boolean
  text: string
  type?: number
  color?: string
  durationTime: () => string
}

const calcuatePronounceTime = (start: number, end: number): number => {
  return (end - start) / 100
}

const WordComponent = ({
  active,
  passed,
  text,
  type,
  durationTime,
  color
}: WordComponentProps) => {
  return (
    <span
      className='llct-call-word'
      data-active={active}
      data-passed={passed}
      data-type={type}
      style={{
        ['--text-color' as string]: color,
        transitionDuration: durationTime()
      }}
    >
      {text || <br></br>}
    </span>
  )
}

const LineComponent = ({ timeline, line, index, time }: LineComponentProps) => {
  const activeLine = line.start < time && line.end > time

  const words = useMemo(
    () =>
      line.words.map((word, i) => {
        const timeLessThanEnd = time < word.end
        const active = activeLine && time > word.start && timeLessThanEnd

        const durationTime = () => {
          return (
            (i !== line.words.length &&
              calcuatePronounceTime(
                word.start,
                line.words[i + 1] ? line.words[i + 1].start : word.end
              ) + 's') ||
            'unset'
          )
        }

        return (
          <WordComponent
            key={i}
            active={active}
            passed={!timeLessThanEnd}
            text={word.text}
            type={word.type}
            durationTime={durationTime}
          ></WordComponent>
        )
      }),
    [
      timeline,
      activeLine,
      line.words.filter(
        word => activeLine && time > word.start && time < word.end
      ).length
    ]
  )

  return (
    <p
      className='llct-call-line'
      key={`call-line:${index}:${activeLine}`}
      data-active={activeLine}
    >
      {...words}
    </p>
  )
}

const CallContainer = ({
  update,
  lastSeek,
  current,
  id
}: CallContainerProps) => {
  const call = useSelector((state: RootState) => state.call)
  const dispatch = useDispatch()

  const [amf, setAmf] = useState<number>(0)

  if (update && amf == 0) {
    const update = () => {
      setAmf((setTimeout(update, 20) as unknown) as number)
    }

    update()
  } else if (!update && amf) {
    clearTimeout(amf)

    if (amf != 0) {
      setAmf(0)
    }
  }

  useEffect(() => {
    if (call.id !== id && id) {
      dispatch(callData.load(id))
    }
  }, [call.id, id])

  return (
    <div className='llct-call'>
      {...call.data
        ? call.data.timeline.map((v, i) => {
            return (
              <LineComponent
                timeline={call.data}
                key={`line:${i}${update}${lastSeek}`}
                index={i}
                line={v}
                time={current()}
              ></LineComponent>
            )
          })
        : [
            <div className='llct-loader-wrapper' key='load'>
              {call.error ? (
                <EmptyComponent
                  key='load-error'
                  text='콜표를 불러올 수 없어요.'
                ></EmptyComponent>
              ) : (
                <LoaderComponent></LoaderComponent>
              )}
            </div>
          ]}
    </div>
  )
}

export default CallContainer

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/components/call/call.scss'
import { RootState } from '@/store'
import * as callData from '@/store/call/actions'
import LoaderComponent from '../loader/component'
import EmptyComponent from '../empty/component'
import ButtonComponent from '../controls/button/component'
import AutoScroller from '../scroller/scroll/container'

interface CallContainerProps {
  current: () => number
  update: boolean
  id: string
  lastSeek: number
  seek?: (time: number) => void
}

interface LineComponentProps {
  line: LLCTCallLine
  index: number
  time: number
  timeline: LLCTCall | null
  showLyrics?: boolean
  seek?: (time: number) => void
}

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

const calcuatePronounceTime = (start: number, end: number): number => {
  return (end - start) / 100
}

const WordComponent = ({
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

const LineComponent = ({
  timeline,
  line,
  index,
  time,
  seek,
  showLyrics
}: LineComponentProps) => {
  const activeLine = line.start > 0 && line.start < time && line.end > time
  const nextLine = timeline?.timeline[index + 1]

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

        const onClick = (time: number) => {
          if (seek) {
            seek(time)
          }
        }

        return (
          <WordComponent
            key={i}
            active={active}
            passed={!timeLessThanEnd}
            text={word.text}
            onClick={onClick}
            start={word.start}
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
      data-margin={
        (!line.text && nextLine && typeof nextLine.text === 'string') ||
        undefined
      }
    >
      {...words}
      {showLyrics && line.text && (
        <span className='line-lyrics'>{line.text}</span>
      )}
    </p>
  )
}

interface CallEditorComponentProps {
  id: string
}

const CallEditorComponent = ({ id }: CallEditorComponentProps) => {
  const openButton = () => {
    window.open(`https://editor.lovelivec.kr/?id=${id}`, 'about:blank')
  }

  return (
    <div className='llct-open-editor-wrapper'>
      <p>이 곡의 콜표 작업을 도와주세요!</p>
      <ButtonComponent onClick={openButton}>
        에디터 열기 (외부 사이트)
      </ButtonComponent>
    </div>
  )
}

const CallContainer = ({
  update,
  lastSeek,
  seek,
  current,
  id
}: CallContainerProps) => {
  const call = useSelector((state: RootState) => state.call)
  const useLyrics = useSelector(
    (state: RootState) => state.settings.useLyrics.value
  ) as boolean
  const autoScroll = useSelector(
    (state: RootState) => state.settings.useAutoScroll.value
  ) as boolean

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
    <AutoScroller
      use={update && Date.now() > lastSeek + 100 && autoScroll}
      scrollToQuery='.llct-call-line[data-active="true"]'
      className='llct-call'
    >
      {...call.data
        ? call.data.timeline.map((v, i) => {
            return (
              <LineComponent
                timeline={call.data}
                key={`line:${i}${update}${lastSeek}`}
                index={i}
                line={v}
                seek={seek}
                time={current()}
                showLyrics={useLyrics}
              ></LineComponent>
            )
          })
        : [
            <div className='llct-loader-wrapper' key='load'>
              {call.error ? (
                <EmptyComponent
                  key='load-error'
                  text={call.error || '콜표를 불러올 수 없어요'}
                >
                  {call.error === '콜표가 없어요.' && call.id && (
                    <CallEditorComponent id={call.id}></CallEditorComponent>
                  )}
                </EmptyComponent>
              ) : (
                <LoaderComponent></LoaderComponent>
              )}
            </div>
          ]}
    </AutoScroller>
  )
}

export default CallContainer

import { useMemo } from 'react'
import { useCallRenderer } from './renderer'
import { WordComponent } from './word'

const calcuatePronounceTime = (start: number, end: number): number => {
  return (end - start) / 100
}

export interface LineComponentProps {
  line: LLCTCallLine
  index: number
  syncAt: () => number
  showLyrics?: boolean
  useSync?: boolean
  seek?: (time: number) => void
}

export const LineComponent = ({
  line,
  index,
  seek,
  syncAt,
  useSync,
  showLyrics
}: LineComponentProps) => {
  console.log('line render')

  const time = syncAt()
  const { activeLine } = useCallRenderer(useSync ?? false, line, time)

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
      // data-margin={
      //   (!line.text && nextLine && typeof nextLine.text === 'string') ||
      //   undefined
      // }
    >
      {...words}
      {showLyrics && line.text && (
        <span className='line-lyrics'>{line.text}</span>
      )}
    </p>
  )
}

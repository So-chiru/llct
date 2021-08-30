import React, { ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/components/call/call.scss'
import { RootState } from '@/store'
import * as callData from '@/store/call/actions'
import LoaderComponent from '../loader/component'
import EmptyComponent from '../empty/component'
import AutoScroller from '../scroller/scroll/container'

import { CallEditorComponent } from './editor-button'
import { LineComponent } from './line'
import { useTick } from './renderer'

const TickContainer = ({
  start = false,
  children,
  time
}: {
  start?: boolean
  children: ReactNode
  time: () => number
}) => {
  useTick(start)

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        time: time()
      })
    }
    return child
  })

  return <>{childrenWithProps}</>
}
interface CallContainerProps {
  current: () => number
  update: boolean
  id: string
  lastSeek: number
  seek?: (time: number) => void
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

  // 서버에서 콜 데이터를 로딩합니다.
  useEffect(() => {
    if (call.id !== id && id) {
      dispatch(callData.load(id))
    }
  }, [call.id, id])

  return (
    <AutoScroller
      use={update && autoScroll}
      scrollToQuery='.llct-call-line[data-active="true"]'
      className='llct-call'
    >
      {call.data ? (
        <TickContainer start={update} time={current}>
          {...call.data.timeline.map((v, i) => {
            return (
              <LineComponent
                key={`line:${i}`}
                index={i}
                line={v}
                seek={seek}
                useSync={update}
                lastSeek={lastSeek}
                showLyrics={useLyrics}
              ></LineComponent>
            )
          })}
        </TickContainer>
      ) : (
        [
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
        ]
      )}
    </AutoScroller>
  )
}

export default CallContainer

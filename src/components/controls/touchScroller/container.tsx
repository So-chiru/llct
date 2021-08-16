import {
  TouchScroller as InternalTouchScroller,
  TouchScrollerDirection
} from '@/core/ui/touch_scroller'

import React, { ReactElement, useRef, useState, useLayoutEffect } from 'react'

interface TouchScrollerProps {
  direction: TouchScrollerDirection
  children: ReactElement
}

export const TouchScroller = ({ direction, children }: TouchScrollerProps) => {
  const [instance, setInstance] = useState<InternalTouchScroller>()
  const ref = useRef<HTMLElement>()

  useLayoutEffect(() => {
    if (instance || !ref.current) {
      return
    }

    const localInstance = new InternalTouchScroller(ref.current, {
      direction
    })

    setInstance(localInstance)
  }, [instance, ref.current])

  return (
    <>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          ref: (el: HTMLElement) => (ref.current = el)
        })
      )}
    </>
  )
}

export default TouchScroller

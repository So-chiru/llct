import { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { ReactNode } from 'react'

interface AutoScrollerProps {
  use: boolean
  className: string
  children: ReactNode
  scrollAfter?: number
  scrollToQuery: string
}

export const AutoScroller = ({
  use,
  className,
  children,
  scrollToQuery,
  scrollAfter = 5000
}: AutoScrollerProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [lastUserWheel, setLastUserWheel] = useState<number>(0)

  useEffect(() => {
    const handleWheel = () => {
      setLastUserWheel(Date.now())
    }

    ref.current?.addEventListener('touchstart', handleWheel)
    ref.current?.addEventListener('wheel', handleWheel)

    return () => {
      ref.current?.removeEventListener('touchstart', handleWheel)
      ref.current?.removeEventListener('wheel', handleWheel)
    }
  }, [ref, use])

  useEffect(() => {
    setLastUserWheel(Date.now())
  }, [use])

  useEffect(() => {
    if (!use) {
      return
    }

    let lastScrolledElement: Element | null = null

    const interval = setInterval(() => {
      if (lastUserWheel + scrollAfter < Date.now()) {
        const all = ref.current?.querySelectorAll(scrollToQuery)

        if (all && all.length && all[all.length - 1] !== lastScrolledElement) {
          all[all.length - 1].scrollIntoView({
            block: 'center',
            behavior: 'smooth'
          })

          lastScrolledElement = all[all.length - 1]
        }
      }
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [use, lastUserWheel])

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  )
}

export default AutoScroller

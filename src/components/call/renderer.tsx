import { useEffect } from 'react'
import { useState } from 'react'

export const useTick = (active: boolean) => {
  const [tick, setTick] = useState<number>(-1)

  useEffect(() => {
    if (!active) return

    const frame = requestAnimationFrame(() => setTick(tick + 1))

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [active, tick])

  return tick
}

export const useCallRenderer = (
  useSync: boolean,
  line: LLCTCallLine,
  time: number
): {
  activeLine?: boolean
} => {
  if (!useSync) {
    return {}
  }

  const activeLine =
    (line.words.length > 1 || line.start > 0) &&
    line.start < time &&
    line.end > time

  return {
    activeLine,
  }
}

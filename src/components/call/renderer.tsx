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

  const activeLine = line.start > 0 && line.start < time && line.end > time

  return {
    activeLine
  }
}

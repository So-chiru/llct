interface PlayerReducerAction {
  id: string
  type: string
  data?: unknown
  pointer?: number
  skip?: number
  error?: unknown
}

interface PlayerController {
  play: () => void
  pause: () => void
  prev: () => void
  progress: () => number
  timecode: () => number
  next: () => void
  seek: (seekTo: number) => void
  toggleEQ: () => void
}

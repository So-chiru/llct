interface PlayerReducerAction {
  id: string
  type: string
  data?: unknown
  pointer?: number
  error?: unknown
}

interface PlayerController {
  play: () => void
  pause: () => void
  progress: () => number
  seek: (seekTo: number) => void
}

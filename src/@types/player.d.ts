interface PlayerReducerAction {
  id: string
  type: string
  data?: unknown
  pointer?: number
  error?: unknown
}

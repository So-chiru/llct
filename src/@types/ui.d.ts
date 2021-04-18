interface LLCTTab {
  name: string
  page?: string
}

interface UIReducerAction {
  type: string
  data: unknown
}

interface LLCTPlayerRelatedComponentProps {
  showPlayer: boolean
}

interface LLCTTabProps {
  show: boolean
}

interface SliderColor {
  background?: string | null
  track?: string | null
  thumb?: string | null
  backgroundDark?: string | null
  trackDark?: string | null
  thumbDark?: string | null
}

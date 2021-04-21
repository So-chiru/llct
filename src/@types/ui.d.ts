interface LLCTTab {
  name: string
  page?: string
}

interface Settings {
  useDarkMode: boolean
  useTranslatedTitle: boolean
  usePlayerColor: boolean
  matchSystemAppearance: boolean
  useAlbumCover: boolean
  audioStack: 'native' | 'advanced'
}

interface SettingsLists {
  name: string
  id: string
}

interface ListsDropboxItems {
  name: string
  id: string
}

interface LLCTSetting<T> {
  name: string
  description: string
  default: T
  value: T
  enable?: (
    state: Record<keyof Settings, LLCTSetting<Settings[keyof Settings]>>
  ) => boolean
  disabled?: boolean
  type: 'checkbox' | 'lists' | 'text' | 'no-control'
  lists?: SettingsLists[]
  onChange?: (value: T) => void
  onInitial?: (value: T) => void
}

interface SettingsReducerAction {
  type: string
  data: Settings[keyof Settings]
  name: keyof Settings
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

interface LLCTNotice {
  title: string
  description: string
}

interface DashboardBirthdayComponent {
  name: string
  color: string
  date?: string
  musics: string[]
}

interface DashboardMusicComponent {
  id: string
  recommendReason?: string
}

interface DashboardLinkComponent {
  title: string
  description: string
  link: string
}

interface DashboardLiveComponent {
  title?: string
  image: string
  start: string
  end: string
  url?: string
  location?: string
  characters: string[]
}

interface DashboardBirthday {
  type: 'birthday'
  birthday: DashboardBirthdayComponent
}

interface DashboardMusic {
  type: 'music'
  music: DashboardMusicComponent
}

interface DashboardLink {
  type: 'link'
  link: DashboardLinkComponent
}

interface DashboardLive {
  type: 'live'
  live: DashboardLiveComponent
}

interface DashboardMusicSet {
  type: 'musicset'
  musicset: string[]
}

interface DashboardLinkSet {
  type: 'linkset'
  linkset: DashboardLinkComponent[]
}

interface DashboardCustomSet {
  type: 'customset'
  linkset: unknown[]
}

type LLCTDashboard =
  | DashboardBirthday
  | DashboardMusic
  | DashboardLink
  | DashboardLive
  | DashboardCustomSet
  | DashboardMusicSet
  | DashboardLinkSet

interface LLCTUpdate {
  updates: number
  notices: LLCTNotice[]
  dashboards: LLCTDashboard[]
}

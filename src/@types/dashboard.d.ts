interface LLCTNotice {
  title: string
  description: string
}

interface DashboardBase {
  type: string
  title?: string
}

interface DashboardBirthdayComponent {
  name: string
  color: string
  date: string
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

interface DashboardBirthday extends DashboardBase {
  type: 'birthday'
  birthday: DashboardBirthdayComponent
}

interface DashboardMusic extends DashboardBase {
  type: 'music'
  music: DashboardMusicComponent
}

interface DashboardLink extends DashboardBase {
  type: 'link'
  link: DashboardLinkComponent
}

interface DashboardLive extends DashboardBase {
  type: 'live'
  live: DashboardLiveComponent
}

interface DashboardMusicSet extends DashboardBase {
  type: 'musicset'
  musicset: DashboardMusicComponent[]
}

interface DashboardLinkSet extends DashboardBase {
  type: 'linkset'
  linkset: DashboardLinkComponent[]
}

interface DashboardCustomSet extends DashboardBase {
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

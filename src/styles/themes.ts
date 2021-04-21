import * as colors from './colors'

export interface ThemeInterface {
  background: string
  text: string
  subtext: string
}

export const light: ThemeInterface = {
  background: colors.background,
  text: colors.accentStrong,
  subtext: colors.backgroundSemiAccent
}

export const dark: ThemeInterface = {
  background: colors.darkBackground,
  text: colors.accent,
  subtext: colors.darkBackgroundSemiAccent
}

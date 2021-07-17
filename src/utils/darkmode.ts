import { backgroundSemiAccent, darkBackgroundSemiAccent } from '@/styles/colors'

/**
 * 시스템이 다크 모드를 사용하는지 확인하여 boolean으로 반환합니다.
 */
export const useDarkMode = (): boolean => {
  return window.matchMedia('screen and (prefers-color-scheme: dark)').matches
}

/**
 * 현재 설정에 맞춰 다크모드 사용 여부를 반환합니다.
 * @param active
 * @param system
 */
export const checkSystemDark = (active: boolean, system: boolean): boolean => {
  return system ? useDarkMode() : active
}

/**
 * 인자 값에 따라서 <html>의 클래스를 지정합니다.
 * @param value
 */
export const toggleDarkMode = (value: boolean) => {
  document.documentElement.classList[value ? 'add' : 'remove']('llct-dark')

  const metaTheme = document.querySelector('meta[name="theme-color"]')

  if (metaTheme) {
    metaTheme.setAttribute(
      'content',
      value ? darkBackgroundSemiAccent : backgroundSemiAccent
    )
  }
}

export const onModeUpdate = (cb: () => void) => {
  const media = window.matchMedia('screen and (prefers-color-scheme: dark)')

  media.addEventListener('change', () => {
    cb()
  })
}

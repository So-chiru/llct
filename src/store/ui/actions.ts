/**
 * 테마를 업데이트합니다.
 * @param useDarkMode 다크모드 사용 여부
 */
export const updateTheme = (useDarkMode: boolean): UIReducerAction => {
  return {
    type: '@llct/theme/update',
    data: useDarkMode
  }
}

/**
 * 현재 탭을 변경합니다.
 */
export const updateTab = (tabNumber: number): UIReducerAction => {
  return {
    type: '@llct/tab/update',
    data: tabNumber
  }
}

/**
 * 플레이어를 표시할지 말지에 대한 여부를 지정합니다.
 *
 * @param show 표시할지에 대한 여부
 */
export const showPlayer = (show: boolean): UIReducerAction => {
  return {
    type: '@llct/player/show',
    data: show
  }
}

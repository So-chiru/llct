interface ThemeReducerAction {
  type: string
  data: boolean
}

/**
 * 테마를 업데이트합니다.
 * @param useDarkMode 다크모드 사용 여부
 */
export const updateTheme = (useDarkMode: boolean): ThemeReducerAction => {
  return {
    type: 'UPDATE_THEME',
    data: useDarkMode
  }
}

const LLCTThemeDefault = {
  useDarkMode: false
}

const ThemeReducer = (
  state = LLCTThemeDefault,
  action: ThemeReducerAction
): typeof LLCTThemeDefault => {
  switch (action.type) {
    case 'UPDATE_THEME':
      return {
        useDarkMode: action.data
      }
    default:
      return state
  }
}

export default ThemeReducer

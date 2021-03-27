import { createGlobalStyle } from 'styled-components'
import { ThemeInterface } from './themes'

export const GlobalStyles = createGlobalStyle<{ theme: ThemeInterface }>`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
  }
`

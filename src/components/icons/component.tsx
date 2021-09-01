import React from 'react'
import { SVGProps } from 'react'

type IconType = (props: SVGProps<SVGSVGElement>) => JSX.Element

export const ArrowDownIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z' />
  </svg>
)

export const ArrowLeftIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z' />
  </svg>
)

export const EqualizerIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M6.17 18a3.001 3.001 0 0 1 5.66 0H22v2H11.83a3.001 3.001 0 0 1-5.66 0H2v-2h4.17zm6-7a3.001 3.001 0 0 1 5.66 0H22v2h-4.17a3.001 3.001 0 0 1-5.66 0H2v-2h10.17zm-6-7a3.001 3.001 0 0 1 5.66 0H22v2H11.83a3.001 3.001 0 0 1-5.66 0H2V4h4.17z' />
  </svg>
)

export const PauseIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M6 5h2v14H6V5zm10 0h2v14h-2V5z' />
  </svg>
)

export const PlayIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z' />
  </svg>
)

export const SkipBackIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M8 11.333l10.223-6.815a.5.5 0 0 1 .777.416v14.132a.5.5 0 0 1-.777.416L8 12.667V19a1 1 0 0 1-2 0V5a1 1 0 1 1 2 0v6.333z' />
  </svg>
)

export const SkipNextIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M16 12.667L5.777 19.482A.5.5 0 0 1 5 19.066V4.934a.5.5 0 0 1 .777-.416L16 11.333V5a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-6.333z' />
  </svg>
)

export const WarningIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z' />
  </svg>
)

export const MusicNoteIcon: IconType = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    {...props}
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' />
  </svg>
)

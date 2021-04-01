import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateTheme } from '@/store/actions/ui'

import '@/styles/tabs/settings.scss'
import { RootState } from '@/store'

const SettingsTab = () => {
  const dispatch = useDispatch()

  const darkTheme = useSelector((state: RootState) => state.ui.useDarkMode)

  const updateThemeButton = (
    ev: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    dispatch(updateTheme((ev.target as HTMLInputElement).checked))
  }

  return (
    <div className='llct-tab'>
      <div className='llct-settings'>
        <div className='llct-settings-row'>
          <label htmlFor='use-dark-theme'>다크 테마 사용: </label>
          <input
            type='checkbox'
            id='use-dark-theme'
            defaultChecked={darkTheme}
            onClick={updateThemeButton}
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsTab

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/tabs/settings.scss'
import { RootState } from '@/store'
import CheckboxContainer from '@/components/check-box/container'

const SettingsTab = ({ show }: LLCTTabProps) => {
  const dispatch = useDispatch()

  const settings = useSelector((state: RootState) => state.settings)

  const clickInputHandler = (checked: boolean, name: string) => {
    dispatch({
      type: '@llct/settings/update',
      name,
      data: checked
    })
  }

  return (
    <div className={`llct-tab${show ? ' show' : ''}`}>
      <div className='llct-settings'>
        {Object.keys(settings).map(id => {
          let controls = <div></div>
          const item = settings[id as keyof Settings]

          if (item.type === 'checkbox') {
            controls = (
              <CheckboxContainer
                id={id}
                checked={item.value as boolean}
                disabled={() => item.enable && !item.enable(settings)}
                onChange={(checked: boolean) => clickInputHandler(checked, id)}
              ></CheckboxContainer>
            )
          }

          return (
            <div className='llct-settings-row' key={id}>
              <label htmlFor={id}>
                <span className='settings-title'>{item.name}</span>
                <span className='settings-desc'>{item.description}</span>
              </label>
              <div className='controls'>{controls}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SettingsTab

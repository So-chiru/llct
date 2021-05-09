import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/tabs/settings.scss'
import { RootState } from '@/store'
import CheckboxContainer from '@/components/controls/check-box/container'
import ListsDropdownContainer from '@/components/controls/lists-dropdown/container'

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

  const changeHandler = (value: string, name: string) => {
    dispatch({
      type: '@llct/settings/update',
      name,
      data: value
    })
  }

  const openPage = (url: string) => {
    window.open(url, 'about:blank')
  }

  return (
    <div className={`llct-tab${show ? ' show' : ''}`} aria-hidden={!show}>
      <div className='llct-settings'>
        <div className='llct-settings-row' tabIndex={500}>
          <div className='info'>
            <h1 className='logo'>
              LLCT <span>LoveLive Call Table</span>
            </h1>
            <p>
              <span
                className='link'
                role='button'
                aria-label={'Github 프로젝트 링크'}
                onClick={() => openPage('https://github.com/So-chiru/llct')}
              >
                Open source project
              </span>{' '}
              by LLCT Contributors. The copyright of each work belongs to
              it&apos;s creator.
            </p>
          </div>
        </div>
        {Object.keys(settings).map((id, i) => {
          let controls = <div></div>
          const item = settings[id as keyof Settings]

          if (item.type === 'checkbox') {
            controls = (
              <CheckboxContainer
                id={id}
                checked={item.value as boolean}
                disabled={() => item.enable && !item.enable(settings)}
                onChange={(checked: boolean) => clickInputHandler(checked, id)}
                ariaIndex={500 + (i + 2)}
              ></CheckboxContainer>
            )
          } else if (item.type === 'lists' && item.lists) {
            controls = (
              <ListsDropdownContainer
                id={id}
                value={item.value as string}
                disabled={() => item.enable && !item.enable(settings)}
                onChange={(value: string) => changeHandler(value, id)}
                items={item.lists}
                ariaIndex={500 + (i + 2)}
              ></ListsDropdownContainer>
            )
          }

          return (
            <div
              className='llct-settings-row'
              key={id}
              role='group'
              aria-labelledby={id + '-settings-desc'}
              tabIndex={500 + (i + 1)}
              aria-controls={id}
            >
              <label htmlFor={id}>
                <span className='settings-title'>{item.name}</span>
                <span
                  className='settings-desc'
                  aria-label={
                    item.name +
                    ' 옵션. ' +
                    item.description +
                    ' 해당 옵션의 타입: ' +
                    item.type
                  }
                  id={id + '-settings-desc'}
                >
                  {item.description}
                </span>
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

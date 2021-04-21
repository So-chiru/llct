import '@/styles/components/controls/check-box/checkbox.scss'

interface CheckboxComponentProps {
  id: string
  onChange: (checked: boolean) => void
  checked: boolean
  disabled?: boolean
  ariaIndex?: number
}

const CheckboxComponent = ({
  id,
  onChange,
  checked,
  disabled,
  ariaIndex
}: CheckboxComponentProps) => {
  const clickHandlerWrapper = (
    ev: React.MouseEvent<HTMLInputElement, MouseEvent> | React.KeyboardEvent
  ) => {
    if (onChange && !disabled) {
      onChange((ev.target as HTMLInputElement).checked)
    }
  }

  return (
    <div
      className={`llct-checkbox${disabled ? ' disabled' : ''}`}
      role='checkbox'
      tabIndex={ariaIndex}
      aria-checked={checked}
      aria-controls={id}
    >
      <input
        type='checkbox'
        defaultChecked={checked}
        id={id}
        disabled={disabled}
        onClick={clickHandlerWrapper}
        onKeyPress={ev =>
          (ev.code === 'Enter' || ev.code === 'Space') &&
          clickHandlerWrapper(ev)
        }
      ></input>
      <div className='thumb' aria-hidden='true'></div>
    </div>
  )
}

export default CheckboxComponent

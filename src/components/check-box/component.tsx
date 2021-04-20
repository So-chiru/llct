import '@/styles/components/check-box/checkbox.scss'

interface CheckboxComponentProps {
  id: string
  onChange: (checked: boolean) => void
  checked: boolean
  disabled?: boolean
}

const CheckboxComponent = ({
  id,
  onChange,
  checked,
  disabled
}: CheckboxComponentProps) => {
  const clickHandlerWrapper = (
    ev: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    if (onChange && !disabled) {
      onChange((ev.target as HTMLInputElement).checked)
    }
  }

  return (
    <div className={`llct-checkbox${disabled ? ' disabled' : ''}`}>
      <input
        type='checkbox'
        defaultChecked={checked}
        id={id}
        disabled={disabled}
        onClick={clickHandlerWrapper}
      ></input>
      <div className='thumb'></div>
    </div>
  )
}

export default CheckboxComponent

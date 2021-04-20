import CheckboxComponent from './component'

interface CheckboxContainerProps {
  id: string
  onChange: (checked: boolean) => void
  checked: boolean
  disabled?: boolean | (() => boolean | undefined)
  name?: string
  ariaIndex?: number
}

const CheckboxContainer = ({
  id,
  onChange,
  checked,
  disabled,
  name,
  ariaIndex
}: CheckboxContainerProps) => {
  if (typeof disabled === 'function') {
    disabled = disabled()
  }

  return (
    <CheckboxComponent
      id={id}
      onChange={onChange}
      checked={checked}
      disabled={disabled}
      name={name}
      ariaIndex={ariaIndex}
    ></CheckboxComponent>
  )
}

export default CheckboxContainer

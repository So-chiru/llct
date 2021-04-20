import CheckboxComponent from './component'

interface CheckboxContainerProps {
  id: string
  onChange: (checked: boolean) => void
  checked: boolean
  disabled?: boolean | (() => boolean | undefined)
}

const CheckboxContainer = ({
  id,
  onChange,
  checked,
  disabled
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
    ></CheckboxComponent>
  )
}

export default CheckboxContainer

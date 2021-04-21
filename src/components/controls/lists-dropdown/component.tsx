import '@/styles/components/controls/lists-dropdown/lists.scss'

interface CheckboxComponentProps {
  id: string
  onChange: (item: string) => void
  value: string
  items: ListsDropboxItems[]
  disabled?: boolean
  ariaIndex?: number
}

const CheckboxComponent = ({
  id,
  onChange,
  value,
  disabled,
  items,
  ariaIndex
}: CheckboxComponentProps) => {
  const clickHandlerWrapper = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange && !disabled) {
      const target = ev.target as HTMLSelectElement
      onChange(target.options[target.selectedIndex].value)
    }
  }

  return (
    <div
      className={`llct-lists-dropdown${disabled ? ' disabled' : ''}`}
      role='dropdown'
      tabIndex={ariaIndex}
      aria-controls={id}
    >
      <select
        onChange={clickHandlerWrapper}
        disabled={disabled}
        id={id}
        defaultValue={value}
      >
        {items.map((v, idx) => {
          return (
            <option key={idx} value={v.id}>
              {v.name}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default CheckboxComponent

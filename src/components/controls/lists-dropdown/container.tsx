import ListsDropdownComponent from './component'

interface ListsDropdownContainerProps {
  id: string
  onChange: (item: string) => void
  value: string
  items: ListsDropboxItems[]
  disabled?: boolean | (() => boolean | undefined)
  ariaIndex?: number
}

const ListsDropdownContainer = ({
  id,
  onChange,
  value,
  items,
  disabled,
  ariaIndex
}: ListsDropdownContainerProps) => {
  if (typeof disabled === 'function') {
    disabled = disabled()
  }

  return (
    <ListsDropdownComponent
      id={id}
      onChange={onChange}
      value={value}
      items={items}
      disabled={disabled}
      ariaIndex={ariaIndex}
    ></ListsDropdownComponent>
  )
}

export default ListsDropdownContainer

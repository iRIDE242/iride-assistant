import { useEffect, useRef } from 'react'
import SizedHeader from './SizedHeader'
import { HeaderSizes, ParentCheckboxProps } from './types'

// Parent checkbox needed to show indeterminate state.
// All the parent checkboxes are host component
// since its state is always defined outside of component.
export default function ParentCheckbox({
  parentCheckbox: { max, selected, checked },
  setParentCheckbox,
  onChange, // Optional. Side action from the component when checking
  inputId,
  inputTitle,
  headerSize,
}: ParentCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = () => {
    onChange && onChange()

    setParentCheckbox(current =>
      current.fromSection === undefined
        ? {
            ...current,
            checked: !current.checked,
            selected: !current.checked === true ? current.max : 0,
          }
        : {
            ...current,
            checked: !current.checked,
            selected: !current.checked === true ? current.max : 0,
            fromSection: false,
          }
    )
  }

  // Manipulater indeterminate value
  useEffect(() => {
    const checkbox = inputRef.current as HTMLInputElement

    if (selected > 0 && selected < max) {
      checkbox.indeterminate = true
    } else {
      checkbox.indeterminate = false
    }
  }, [max, selected])

  return (
    <>
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        ref={inputRef}
        onChange={handleChange}
        style={{ marginLeft: '8px' }}
      />
      <label htmlFor={inputId}>
        <SizedHeader headerSize={headerSize}>
          {headerSize === HeaderSizes.H2 || headerSize === HeaderSizes.H3
            ? inputTitle.toUpperCase()
            : inputTitle}
        </SizedHeader>
      </label>
    </>
  )
}

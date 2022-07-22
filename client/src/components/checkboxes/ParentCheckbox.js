import { useEffect, useRef } from 'react'

function SizedHeader({ headerSize, children }) {
  const style = {
    display: 'inline-block',
  }

  return (
    <>
      {headerSize === 'h2' && <h2 style={style}>{children}</h2>}
      {headerSize === 'h3' && <h3 style={style}>{children}</h3>}
      {!headerSize && <p style={style}>{children}</p>}
    </>
  )
}

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
}) {
  const inputRef = useRef()

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
    if (selected > 0 && selected < max) {
      inputRef.current.indeterminate = true
    } else {
      inputRef.current.indeterminate = false
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
          {headerSize === 'h2' || headerSize === 'h3'
            ? inputTitle.toUpperCase()
            : inputTitle}
        </SizedHeader>
      </label>
    </>
  )
}

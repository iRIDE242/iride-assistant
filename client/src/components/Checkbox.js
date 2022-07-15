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

// For checkbox needed to show indeterminate state
export default function Checkbox({
  checkbox,
  setCheckbox,
  inputId,
  inputTitle,
  headerSize,
}) {
  const inputRef = useRef()

  const handleChange = () => {
    setCheckbox(prev => {
      if (!prev.checked === true) {
        return {
          ...prev,
          checked: !prev.checked,
          // selected:
          //   prev.selected + 1 > prev.max ? prev.selected : prev.selected + 1,
        }
      } else {
        return {
          ...prev,
          checked: !prev.checked,
          // selected: prev.selected - 1 < 0 ? prev.selected : prev.selected - 1,
        }
      }
    })
  }

  useEffect(() => {
    console.log('effect - checkbox')
    const { max, selected } = checkbox

    // console.log(selected)
    // The conditon here can avoid the loop bug
    // when both selected and length are 0.
    if (selected !== null) {
      if (selected > 0 && selected < max) {
        inputRef.current.indeterminate = true
      } else {
        // This condition should be only for when length is not 0
        inputRef.current.indeterminate = false
      }
    }
  }, [checkbox])

  return (
    <>
      <input
        type="checkbox"
        id={inputId}
        checked={checkbox.checked}
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

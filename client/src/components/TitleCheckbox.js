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
export default function TitleCheckbox({
  selected,
  length,
  checked,
  setChecked,
  inputId,
  inputTitle,
  headerSize,
}) {
  const inputRef = useRef()

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  useEffect(() => {
    console.log('effect - checkbox')
    console.log(selected)
    // The conditon here can avoid the loop bug
    // when both selected and length are 0.
    // if (selected !== null) {
      if (selected === 0) {
        setChecked(false)
        inputRef.current.indeterminate = false
      } else if (selected > 0 && selected < length) {
        inputRef.current.indeterminate = true
      } else if (selected === length) {
        // This condition should be only for when length is not 0
        setChecked(true)
        inputRef.current.indeterminate = false
      }
    // }
  }, [length, selected, setChecked])

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

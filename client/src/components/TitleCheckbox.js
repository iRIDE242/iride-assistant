import { useEffect, useRef } from 'react'

function SizedHeader({ headerSize, children }) {
  const style = {
    display: 'inline-block',
  }

  return (
    <>
      {headerSize === 'h2' && (<h2 style={style}>{children}</h2>)}
      {headerSize === 'h3' && (<h3 style={style}>{children}</h3>)}
    </>
  )
}

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
    if (!selected) {
      setChecked(false)
      inputRef.current.indeterminate = false
    }

    if (selected > 0 && selected < length)
      inputRef.current.indeterminate = true

    if (selected === length) {
      setChecked(true)
      inputRef.current.indeterminate = false
    }
  }, [length, selected, setChecked])

  return (
    <>
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        ref={inputRef}
        onChange={handleChange}
      />
      <label htmlFor={inputId}>
        <SizedHeader headerSize={headerSize}>{inputTitle}</SizedHeader>
      </label>
    </>
  )
}

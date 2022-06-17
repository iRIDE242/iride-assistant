import { useEffect, useRef } from 'react'

export default function TitleCheckbox({
  selected,
  hiddenVariants,
  product,
  checked,
  setChecked,
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

    if (selected > 0 && selected < hiddenVariants.length)
      inputRef.current.indeterminate = true

    if (selected === hiddenVariants.length) {
      setChecked(true)
      inputRef.current.indeterminate = false
    }
  }, [hiddenVariants.length, selected, setChecked])

  return (
    <>
      <input
        type="checkbox"
        id={`hidden-product-${product.id}`}
        checked={checked}
        ref={inputRef}
        onChange={handleChange}
      />
      <label htmlFor={`hidden-product-${product.id}`}>
        <h3 style={{ display: 'inline-block' }}>{product.title}</h3>
      </label>
    </>
  )
}

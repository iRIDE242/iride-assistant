import { useEffect, useState } from 'react'

export default function FilteredVariant({
  product,
  variant,
  checkedFromProduct,
  checkedFromSection,
  setSelected,
  setSelectedFromAbove,
}) {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  // Sync with product checkbox
  useEffect(() => {
    setChecked(checkedFromProduct)
  }, [checkedFromProduct])

  // Sync with section checkbox
  useEffect(() => {
    setChecked(checkedFromSection)
  }, [checkedFromSection])

  useEffect(() => {
    if (checked) {
      setSelected(prev => prev + 1)
      setSelectedFromAbove(prev => prev + 1)
    } else {
      setSelected(prev => {
        if (!prev) return prev
        return prev - 1
      })
      setSelectedFromAbove(prev => {
        if (!prev) return prev
        return prev - 1
      })
    }
  }, [checked, setSelected, setSelectedFromAbove])

  return (
    <>
      <input
        type="checkbox"
        id={variant.id}
        checked={checked}
        onChange={handleChange}
      />
      <label
        htmlFor={variant.id}
      >{`${product.title} - ${variant.title}`}</label>
    </>
  )
}

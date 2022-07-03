import { useEffect, useState } from 'react'

export default function FilteredVariant({
  product,
  variant,
  checkedFromProduct,
  checkedFromSection,
  setSelectedFromProduct,
  setSelectedFromSection,
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

  // Manipulate upper lever selected states for the indeterminate state of checkbox
  useEffect(() => {
    if (checked) {
      setSelectedFromProduct(prev => prev + 1)
      setSelectedFromSection(prev => prev + 1)
    } else {
      setSelectedFromProduct(prev => {
        if (!prev) return prev
        return prev - 1
      })
      setSelectedFromSection(prev => {
        if (!prev) return prev
        return prev - 1
      })
    }
  }, [checked, setSelectedFromProduct, setSelectedFromSection])

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

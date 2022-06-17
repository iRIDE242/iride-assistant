import { useEffect, useState } from 'react'

export default function HiddenVariant({
  product,
  variant,
  checkedFromProduct,
  checkedFromInfo,
  setSelected,
}) {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  useEffect(() => {
    setChecked(checkedFromProduct)
  }, [checkedFromProduct])

  useEffect(() => {
    setChecked(checkedFromInfo)
  }, [checkedFromInfo])

  useEffect(() => {
    checked
      ? setSelected(prev => prev + 1)
      : setSelected(prev => {
          if (!prev) return prev
          return prev - 1
        })
  }, [checked, setSelected])

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

import { useEffect, useState } from 'react'

export default function VariantVariant({
  product,
  variant,
  checked: checkedFromProduct,
}) {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  useEffect(() => {
    setChecked(checkedFromProduct)
  }, [checkedFromProduct])

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

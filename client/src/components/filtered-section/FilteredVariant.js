import { useEffect, useState } from 'react'
import { useCheckbox } from '../../utils/customHooks'

export default function FilteredVariant({
  product,
  variant,
  checkedFromProduct,
  checkedFromSection,
  setSelectedFromProduct,
  setSelectedFromSection,
}) {
  const [checked, , handleChange] = useCheckbox(
    checkedFromSection,
    setSelectedFromSection,
    checkedFromProduct,
    setSelectedFromProduct
  )

  const [discount, setDiscout] = useState('')
  const [price, setPrice] = useState(0.0)
  const [cap, setCap] = useState(null)

  const modifyDiscount = e => {
    setDiscout(e.target.value)
  }

  useEffect(() => {
    const { price, compare_at_price } = variant

    setPrice(price)
    setCap(compare_at_price)
  }, [variant])

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

      <label style={{ marginLeft: '4px' }}>
        <strong>Discount: </strong>
      </label>
      <input
        style={{ width: '40px' }}
        type="number"
        value={discount}
        onChange={modifyDiscount}
      />

      <span style={{ marginLeft: '4px' }}>
        <strong>Price: </strong>
        {price}
      </span>
      <span style={{ marginLeft: '4px' }}>
        <strong>CAP: </strong>
        {cap}
      </span>
    </>
  )
}

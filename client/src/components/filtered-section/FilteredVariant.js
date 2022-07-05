import { useEffect, useRef, useState } from 'react'
import { useCheckbox } from '../../utils/customHooks'

const getOriginalPrice = (price, cap) => {
  const priceNumber = Number(price)
  const capNumber = Number(cap)

  return capNumber ? capNumber : priceNumber
}

const getDiscountedPrice = (discount, originalPrice) => {
  const discountedPrice = Math.ceil(originalPrice - (originalPrice * discount) / 100)
  return discountedPrice > originalPrice ? originalPrice : discountedPrice
}

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

  const originalPrice = useRef(
    getOriginalPrice(variant.price, variant.compare_at_price)
  )

  const modifyDiscount = e => {
    const originalPriceValue = originalPrice.current
    const discountNumber = Number(e.target.value)
    setDiscout(discountNumber)

    console.log(discountNumber)
    console.log(typeof discountNumber)

    setCap(discountNumber ? originalPriceValue : null)
    setPrice(
      discountNumber
        ? getDiscountedPrice(discountNumber, originalPriceValue)
        : originalPriceValue
    )
  }

  useEffect(() => {
    const { price, compare_at_price } = variant

    setPrice(Number(price))
    setCap(compare_at_price ? Number(compare_at_price) : null)
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
      <span>%</span>

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

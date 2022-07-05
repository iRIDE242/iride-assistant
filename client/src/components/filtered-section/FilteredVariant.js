import { useEffect, useRef, useState } from 'react'
import { useCheckbox } from '../../utils/customHooks'

const getOriginalPrice = (price, cap) => {
  const priceNumber = Number(price)
  const capNumber = Number(cap)

  return capNumber ? capNumber : priceNumber
}

const getDiscountedPrice = (discount, originalPrice) => {
  const discountedPrice = Math.ceil(
    originalPrice - (originalPrice * discount) / 100
  )
  return discountedPrice > originalPrice ? originalPrice : discountedPrice
}

const getDiscount = (price, cap) => {
  if (!cap) return ''
  return Math.ceil(100 - (Number(price) / Number(cap)) * 100)
}

const getPriceSetting = variant => {
  const { price, compare_at_price } = variant

  return {
    price: Number(price),
    cap: compare_at_price === null ? null : Number(compare_at_price),
    discount: getDiscount(price, compare_at_price),
  }
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

  const [priceSetting, setPriceSetting] = useState({
    price: 0.0,
    cap: null,
    discount: '',
  })

  const originalPriceSetting = useRef(getPriceSetting(variant))

  const modifyDiscount = e => {
    const {
      current: { price, cap },
    } = originalPriceSetting

    const originalPrice = getOriginalPrice(price, cap)
    const discountNumber = Number(e.target.value)

    setPriceSetting({
      price: discountNumber
        ? getDiscountedPrice(discountNumber, originalPrice)
        : originalPrice,
      cap: discountNumber ? originalPrice : null,
      discount: discountNumber,
    })
  }

  useEffect(() => {
    console.log('useEffect')
    setPriceSetting(originalPriceSetting.current)
  }, [])

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
        value={priceSetting.discount}
        onChange={modifyDiscount}
        min="0"
        max="100"
      />
      <span>%</span>

      <span style={{ marginLeft: '4px' }}>
        <strong>Price: </strong>
        {priceSetting.price}
      </span>
      <span style={{ marginLeft: '4px' }}>
        <strong>CAP: </strong>
        {priceSetting.cap}
      </span>
    </>
  )
}

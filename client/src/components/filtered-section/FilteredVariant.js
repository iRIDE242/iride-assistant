import { useEffect, useRef, useState } from 'react'
import { idRoles } from '../../utils/config'
import { useCheckbox } from '../../utils/customHooks'
import { MODIFIED, NOT_MODIFIED } from '../../utils/helper'

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

const getPriceSetting = (variant, discountFromProduct) => {
  // Examples:
  // Number('') or Number('   ') -> 0  Number('   ') won't happen here thanks to number input
  // Number('sa') -> NaN  This case won't happen here thanks to number input
  // Number('0') -> 0
  // Number('23') -> 23
  // Number(undefined) -> NaN

  const { price, compare_at_price } = variant
  const originalPrice = getOriginalPrice(price, compare_at_price)

  // discountFromProduct is absent or discount from above is not modified
  // discountFromProduct -> undefined
  if (
    discountFromProduct === undefined ||
    discountFromProduct?.state === NOT_MODIFIED
  ) {
    return {
      price: Number(price),
      cap: compare_at_price ? Number(compare_at_price) : compare_at_price,
      discount: getDiscount(price, compare_at_price),
    }
  }

  const { state, value } = discountFromProduct
  const discountNumber = Number(value)

  if (state === MODIFIED) {
    // Number('') -> 0
    if (value === '') {
      return {
        price: originalPrice,
        cap: null,
        discount: '',
      }
    }

    if (discountNumber) {
      // Number('23') -> 23
      return {
        price: getDiscountedPrice(discountNumber, originalPrice),
        cap: originalPrice,
        discount: discountNumber,
      }
    } else {
      // Number('0') -> 0
      return {
        price: originalPrice,
        cap: originalPrice,
        discount: discountNumber,
      }
    }
  }
}

const arePriceSettingsIdentical = (refCurrent, variant) => {
  return (
    refCurrent.price === Number(variant.price) &&
    Number(refCurrent.cap) === Number(variant.compare_at_price)
  )
}

export default function FilteredVariant({
  product,
  variant,
  checkedFromProduct,
  checkedFromSection,
  setSelectedFromProduct,
  setSelectedFromSection,
  discountFromProduct,
  resetFromProduct,
}) {
  const [originalPriceSetting, setOriginalPriceSetting] = useState(() =>
    getPriceSetting(variant)
  )

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

  const reset = useRef(0)

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
      discount: e.target.value === '' ? e.target.value : discountNumber,
    })
  }

  const resetPriceSetting = e => {
    e.preventDefault()
    setPriceSetting(originalPriceSetting)
  }

  useEffect(() => {
    if (!arePriceSettingsIdentical(originalPriceSetting, variant)) {
      console.log('not identical')
      setOriginalPriceSetting(getPriceSetting(variant))
    }
  }, [originalPriceSetting, variant])

  useEffect(() => {
    setPriceSetting(getPriceSetting(variant, discountFromProduct))
  }, [discountFromProduct, variant])

  useEffect(() => {
    if (reset.current !== resetFromProduct) {
      console.log('reset from product')
      reset.current = resetFromProduct
      setPriceSetting(originalPriceSetting)
    }
  }, [originalPriceSetting, resetFromProduct])

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

      <label
        style={{ marginLeft: '4px' }}
        htmlFor={`${variant.id}-${idRoles.discount}`}
      >
        <strong>Discount: </strong>
      </label>
      <input
        id={`${variant.id}-${idRoles.discount}`}
        style={{ width: '40px' }}
        type="number"
        value={priceSetting.discount}
        onChange={modifyDiscount}
        min="0"
        max="100"
      />
      <span>%</span>

      <label style={{ marginLeft: '4px' }}>
        <strong>Price: </strong>
      </label>
      <input
        type="text"
        value={priceSetting.price}
        readOnly
        style={{ width: '50px' }}
      />

      <label style={{ marginLeft: '4px' }}>
        <strong>CAP: </strong>
      </label>
      <input
        type="text"
        value={priceSetting.cap}
        readOnly
        style={{ width: '50px' }}
      />

      <button onClick={resetPriceSetting}>RESET PRICE SETTING</button>
    </>
  )
}

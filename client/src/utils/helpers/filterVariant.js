import { MODIFIED, NOT_MODIFIED, SELECTED_MODIFIED } from '../helper'

export const getOriginalPrice = (price, cap) => {
  const priceNumber = Number(price)
  const capNumber = Number(cap)

  return capNumber ? capNumber : priceNumber
}

export const getDiscountedPrice = (discount, originalPrice) => {
  const discountedPrice = Math.ceil(
    originalPrice - (originalPrice * discount) / 100
  )
  return discountedPrice > originalPrice ? originalPrice : discountedPrice
}

const getDiscount = (price, cap) => {
  if (!cap) return ''
  return Math.ceil(100 - (Number(price) / Number(cap)) * 100)
}

export const getPriceSetting = (variant, discountFromProduct, current) => {
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
      cap: compare_at_price ? Number(compare_at_price) : '',
      discount: getDiscount(price, compare_at_price),
    }
  }

  // For selected only changes
  if (discountFromProduct?.state === SELECTED_MODIFIED) return current

  const { state, value } = discountFromProduct
  const discountNumber = Number(value)

  if (state === MODIFIED) {
    // Number('') -> 0
    if (value === '') {
      return {
        price: originalPrice,
        cap: '',
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

export const arePriceSettingsIdentical = (refCurrent, variant) => {
  return (
    refCurrent.price === Number(variant.price) &&
    Number(refCurrent.cap) === Number(variant.compare_at_price)
  )
}

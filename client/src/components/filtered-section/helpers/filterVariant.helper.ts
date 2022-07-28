import { Variant } from 'components/types'
import {
  Blank,
  DiscountState,
  DiscountStatus,
  PriceSettingState,
} from 'custom-hooks/types'

export const getOriginalPrice = (
  price: string | number,
  cap: null | string | number
) => {
  const priceNumber = Number(price)
  const capNumber = Number(cap)

  return capNumber ? capNumber : priceNumber
}

export const getDiscountedPrice = (discount: number, originalPrice: number) => {
  const discountedPrice = Math.ceil(
    originalPrice - (originalPrice * discount) / 100
  )
  return discountedPrice > originalPrice ? originalPrice : discountedPrice
}

const getDiscount = (price: string, cap: null | string) => {
  if (!cap) return Blank.blank_string
  return Math.ceil(100 - (Number(price) / Number(cap)) * 100)
}

export const getPriceSetting = (
  variant: Variant,
  discountFromProduct?: DiscountState,
  current?: PriceSettingState
) => {
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
    discountFromProduct?.status === DiscountStatus.SHOW_INITIAL
  ) {
    return {
      price: Number(price),
      cap: compare_at_price ? Number(compare_at_price) : Blank.blank_string,
      discount: getDiscount(price, compare_at_price),
    }
  }

  // For selected only changes
  if (discountFromProduct?.status === DiscountStatus.KEEP_VALUE && current)
    return current

  const { value } = discountFromProduct
  const discountNumber = Number(value)

  // Number('') -> 0
  if (value === Blank.blank_string) {
    return {
      price: originalPrice,
      cap: Blank.blank_string,
      discount: Blank.blank_string,
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

export const arePriceSettingsIdentical = (
  originalPriceSetting: PriceSettingState,
  currentVariant: Variant
) => {
  return (
    originalPriceSetting.price === Number(currentVariant.price) &&
    Number(originalPriceSetting.cap) === Number(currentVariant.compare_at_price)
  )
}

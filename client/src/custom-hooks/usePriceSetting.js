import { useEffect, useState } from 'react'
import { getPriceSetting } from '../utils/helpers/filterVariant'
import { SHOW_INITIAL } from './useDiscount'

export default function usePriceSetting(
  isSelectedOnly,
  checked,
  discountFromProduct,
  variant
) {
  const [priceSetting, setPriceSetting] = useState({
    price: 0.0,
    cap: '',
    discount: '',
  })

  // Sync the discount change from product to modify price setting with conditions
  useEffect(() => {
    if (
      !isSelectedOnly ||
      (isSelectedOnly &&
        (checked || discountFromProduct.state === SHOW_INITIAL))
    )
      setPriceSetting(current =>
        getPriceSetting(variant, discountFromProduct, current)
      )
  }, [checked, discountFromProduct, isSelectedOnly, variant])

  return [priceSetting, setPriceSetting]
}

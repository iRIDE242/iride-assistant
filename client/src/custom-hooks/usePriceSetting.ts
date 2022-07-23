import { Variant } from 'components/types'
import { useEffect, useState } from 'react'
import { getPriceSetting } from '../utils/helpers/filterVariant'
import { DiscountState, DiscountStatus, PriceSettingState } from './types'

export default function usePriceSetting(
  isSelectedOnly: boolean,
  checked: boolean,
  discountFromProduct: DiscountState,
  variant: Variant
) {
  const [priceSetting, setPriceSetting] = useState<PriceSettingState>({
    price: 0.0,
    cap: '',
    discount: '',
  })

  // Sync the discount change from product to modify price setting with conditions
  useEffect(() => {
    if (
      !isSelectedOnly ||
      (isSelectedOnly &&
        (checked || discountFromProduct.status === DiscountStatus.SHOW_INITIAL))
    )
      setPriceSetting(current =>
        getPriceSetting(variant, discountFromProduct, current)
      )
  }, [checked, discountFromProduct, isSelectedOnly, variant])

  return [priceSetting, setPriceSetting] as const
}

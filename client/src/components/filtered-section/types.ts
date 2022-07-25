import { Product, Variant } from 'components/types'
import { DiscountState, PriceSettingState } from 'custom-hooks/types'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export interface FilteredVariantProps {
  product: Product
  variant: Variant
  checkedFromProduct: boolean
  fromSection?: boolean
  setCheckboxFromProduct: Dispatch<SetStateAction<ParentCheckboxState>>
  setCheckboxFromSection?: Dispatch<SetStateAction<ParentCheckboxState>>
  discountFromProduct: DiscountState
  resetFromProduct: number
  isSelectedOnly: boolean
  setDiscount: Dispatch<SetStateAction<DiscountState>>
}

export interface ParentCheckboxState {
  max: number
  checked: boolean
  selected: number
  fromSection?: boolean
}

export interface VariantResetButtonProps {
  resetCurrentFromProduct: number
  resetCurrentFromSection: number
  originalPriceSetting: PriceSettingState
  setPriceSetting: Dispatch<SetStateAction<PriceSettingState>>
  children: ReactNode
}

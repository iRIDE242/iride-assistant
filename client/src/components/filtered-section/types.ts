import { Product, Variant } from 'components/types'
import { DiscountState } from 'custom-hooks/types'
import { Dispatch, SetStateAction } from 'react'

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
  resetFromProduct: number
  resetFromSection: number
}

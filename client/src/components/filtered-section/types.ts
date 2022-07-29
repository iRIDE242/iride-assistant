import { Product, Variant } from 'components/types'
import {
  DiscountState,
  NumberOrBlank,
  PriceSettingState,
} from 'custom-hooks/types'
import { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react'

export interface FilteredVariantProps {
  product: Product
  variant: Variant
  checkedFromProduct: boolean
  fromSection: boolean
  setCheckboxFromProduct: Dispatch<SetStateAction<ParentCheckboxState>>
  setCheckboxFromSection: Dispatch<SetStateAction<ParentCheckboxState>>
  discountFromProduct: DiscountState
  resetFromSection: number
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

export interface ResetButtonProps {
  resetFromProduct: number
  resetFromSection: number
  originalPriceSetting: PriceSettingState
  setPriceSetting: Dispatch<SetStateAction<PriceSettingState>>
  children: ReactNode
}

export interface FilteredProductProps {
  product: Product
  checked: boolean
  setCheckbox: Dispatch<SetStateAction<ParentCheckboxState>>
  discountFromSection: DiscountState
  resetFromSection: number
  showVariants: ParentCheckboxState
  setShowVariants: Dispatch<SetStateAction<ParentCheckboxState>>
  selectedOnly: ParentCheckboxState
  setSelectedOnly: Dispatch<SetStateAction<ParentCheckboxState>>
}

export interface PercentageInputProps {
  id: string
  discountValue: NumberOrBlank
  handleDiscountChange: (e: FormEvent<HTMLInputElement>) => void
}

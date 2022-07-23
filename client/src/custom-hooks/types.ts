import { ParentCheckboxState } from 'components/filtered-section/types'
import { Dispatch, SetStateAction } from 'react'

// useChildCheckbox
export interface ChildCheckboxState {
  checked: boolean
  fromParent: boolean
  fromSection: null | boolean
}

export interface UseChildCheckboxArgs {
  checkedFromParent: boolean
  setParentCheckbox: Dispatch<SetStateAction<ParentCheckboxState>>
  setGrandParentCheckbox?: Dispatch<SetStateAction<ParentCheckboxState>>
  fromSection?: boolean
}

// useDiscount
export enum DiscountStatus {
  SHOW_INITIAL,
  STAY_SYNCED,
  KEEP_VALUE,
}

export interface DiscountState {
  status: DiscountStatus
  value: string | number
}

// usePriceSetting
export interface PriceSettingState {
  price: number
  cap: string | number
  discount: string | number
}

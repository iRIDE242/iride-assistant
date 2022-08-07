import { ParentCheckboxState } from 'components/filtered-section/types'
import { Dispatch, SetStateAction } from 'react'

export enum Blank {
  blank_string = '',
}

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

export type NumberOrBlank = Blank.blank_string | number

export interface DiscountState {
  status: DiscountStatus
  value: NumberOrBlank
}

// usePriceSetting
export interface PriceSettingState {
  price: number
  cap: NumberOrBlank
  discount: NumberOrBlank
}

// useLocalStorageState
export enum LocalStorageKeys {
  IGNORED_PRODUCT_IDS = 'ignoredProductIds',
  IGNORED_OUT_OF_STOCK_IDS = 'ignoredOutOfStockIds',
  IGNORED_VENDORS = 'ignoredVendors',
}

export type GetInitialValue<LocalStorageState> = () =>
  | LocalStorageState
  | LocalStorageState[]
  | Blank.blank_string

export interface UseLocalStorageStateArg<LocalStorageState> {
  key: LocalStorageKeys
  initialValue?:
    | LocalStorageState
    | LocalStorageState[]
    | GetInitialValue<LocalStorageState>
    | Blank.blank_string
  methods?: {
    serialize?: <LocalStorageState>(
      state: LocalStorageState | LocalStorageState[] | Blank.blank_string
    ) => string
    deserialize?: <LocalStorageState>(
      value: string
    ) => LocalStorageState | LocalStorageState[] | Blank.blank_string
  }
}

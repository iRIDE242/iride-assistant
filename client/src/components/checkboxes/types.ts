import { ParentCheckboxState } from 'components/filtered-section/types'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export interface ChildCheckboxHostProps {
  id: string
  label: string
  checked: boolean
  onChange?: () => void
  handleCheckboxChange: () => void
}

export interface SizedHeaderArg {
  headerSize?: string
  children: ReactNode
}

export enum HeaderSizes {
  H2 = 'h2',
  H3 = 'h3',
}

export interface ParentCheckboxProps {
  parentCheckbox: ParentCheckboxState
  setParentCheckbox: Dispatch<SetStateAction<ParentCheckboxState>>
  onChange?: () => void
  inputId: string
  inputTitle: string
  headerSize?: HeaderSizes
}

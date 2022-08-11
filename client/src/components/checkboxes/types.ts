import { ParentCheckboxState } from 'components/filtered-section/types'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export interface ChildCheckboxHostProps {
  id: string
  label: string
  checked: boolean
  onChange?: () => void
  handleCheckboxChange: () => void
}

export interface SizedHeaderProps {
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

export interface ChildCheckboxProps {
  id: string
  label: string
  checkedFromParent: boolean
  setParentCheckbox: Dispatch<SetStateAction<ParentCheckboxState>>
  setGrandParentCheckbox?: Dispatch<SetStateAction<ParentCheckboxState>>
  fromSection?: boolean
  onChange?: () => void
}

import { ParentCheckboxState } from 'components/filtered-section/types'
import {
  ComponentPropsWithoutRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { callAll, updateParentCheckbox } from '../utils/helper'
import { ChildCheckboxState } from './types'

// For child checkbox which state is defined outside of component
// since its state is also used by other components.
export const useChildCheckbox = (
  checkedFromParent: boolean,
  setParentCheckbox: Dispatch<SetStateAction<ParentCheckboxState>>,
  setGrandParentCheckbox?: Dispatch<SetStateAction<ParentCheckboxState>>, // optional
  fromSection?: boolean // optional
) => {
  const [checkbox, setCheckbox] = useState<ChildCheckboxState>({
    checked: false,
    fromParent: true,
    fromSection: null,
  })

  const handleCheckboxChange = () => {
    setCheckbox(current => ({
      checked: !current.checked,
      fromParent: false,
      fromSection: current.fromSection === null ? null : false,
    }))
  }

  const getCheckboxProps = ({
    onChange,
    id,
    type,
    checked,
  }: ComponentPropsWithoutRef<'input'>) => ({
    id,
    type,
    checked,
    onChange: callAll(onChange, handleCheckboxChange),
  })

  // Synced with parent checkbox state
  useEffect(() => {
    setCheckbox(current => ({
      checked: checkedFromParent,
      fromParent: true,
      fromSection:
        fromSection === undefined ? current.fromSection : fromSection,
    }))
  }, [checkedFromParent, fromSection])

  // Update selected state in parent checkbox for indeterminate value.
  // Only responde to the checked change caused by the component itself,
  // but not checked change caused by the parent checkbox sync.
  useEffect(() => {
    updateParentCheckbox(
      checkbox.checked,
      checkbox.fromParent,
      setParentCheckbox
    )
  }, [checkbox.checked, checkbox.fromParent, setParentCheckbox])

  // Update selected state in grandparent checkbox for indeterminate value.
  useEffect(() => {
    setGrandParentCheckbox &&
      checkbox.fromSection !== null &&
      updateParentCheckbox(
        checkbox.checked,
        checkbox.fromSection,
        setGrandParentCheckbox
      )
  }, [checkbox.checked, checkbox.fromSection, setGrandParentCheckbox])

  return [checkbox, handleCheckboxChange, getCheckboxProps] as const
}

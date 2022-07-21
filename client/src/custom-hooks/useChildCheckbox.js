import { useEffect, useState } from 'react'
import { callAll, updateParentCheckbox } from '../utils/helper'

// For child checkbox which state is defined outside of component
// since its state is also used by other components.
export const useChildCheckbox = (
  checkedFromParent,
  setParentCheckbox,
  setGrandParentCheckbox, // optional
  fromSection // optional
) => {
  const [checkbox, setCheckbox] = useState({
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

  const getCheckboxProps = ({ onChange, ...props }) => ({
    onChange: callAll(onChange, handleCheckboxChange),
    ...props,
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

  return [checkbox, handleCheckboxChange, getCheckboxProps]
}

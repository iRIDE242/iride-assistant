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
  const [childCheckbox, setChildCheckbox] = useState({
    checked: false,
    fromParent: true,
    fromSection: null,
  })

  const handleChildCheckboxChange = () => {
    setChildCheckbox(current => ({
      checked: !current.checked,
      fromParent: false,
      fromSection: current.fromSection === null ? null : false,
    }))
  }

  const getChildCheckboxProps = ({ onChange, ...props }) => ({
    onChange: callAll(onChange, handleChildCheckboxChange),
    ...props,
  })

  // Synced with parent checkbox state
  useEffect(() => {
    setChildCheckbox(current => ({
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
      childCheckbox.checked,
      childCheckbox.fromParent,
      setParentCheckbox
    )
  }, [childCheckbox.checked, childCheckbox.fromParent, setParentCheckbox])

  // Update selected state in grandparent checkbox for indeterminate value.
  useEffect(() => {
    setGrandParentCheckbox &&
      childCheckbox.fromSection !== null &&
      updateParentCheckbox(
        childCheckbox.checked,
        childCheckbox.fromSection,
        setGrandParentCheckbox
      )
  }, [childCheckbox.checked, childCheckbox.fromSection, setGrandParentCheckbox])

  return [childCheckbox, handleChildCheckboxChange, getChildCheckboxProps]
}

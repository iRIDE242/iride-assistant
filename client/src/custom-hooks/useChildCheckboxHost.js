import { useEffect, useState } from 'react'
import { updateParentCheckbox } from '../utils/helper'

// For child checkbox which state is defined outside of component
// since its state is also used by other components.
export const useChildCheckboxHost = (
  checkedFromParent,
  setParentCheckbox,
  setGrandParentCheckbox,
  fromSection
) => {
  const [childCheckboxHost, setChildCheckboxHost] = useState({
    checked: false,
    fromParent: true,
    fromSection: null,
  })

  const handleCheckboxHostChange = () => {
    setChildCheckboxHost(current => ({
      checked: !current.checked,
      fromParent: false,
      fromSection: current.fromSection === null ? null : false,
    }))
  }

  // Synced with parent checkbox state
  useEffect(() => {
    console.log('host - toggle child checkebox from parent')
    setChildCheckboxHost(current => ({
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
      childCheckboxHost.checked,
      childCheckboxHost.fromParent,
      setParentCheckbox
    )
  }, [
    childCheckboxHost.checked,
    childCheckboxHost.fromParent,
    setParentCheckbox,
  ])

  // Update selected state in grandparent checkbox for indeterminate value.
  useEffect(() => {
    setGrandParentCheckbox &&
      childCheckboxHost.fromSection !== null &&
      updateParentCheckbox(
        childCheckboxHost.checked,
        childCheckboxHost.fromSection,
        setGrandParentCheckbox
      )
  }, [
    childCheckboxHost.checked,
    childCheckboxHost.fromSection,
    setGrandParentCheckbox,
  ])

  return [childCheckboxHost, handleCheckboxHostChange]
}

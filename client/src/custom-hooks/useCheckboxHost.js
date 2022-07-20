import { useEffect, useState } from 'react'
import { updateParentCheckbox } from '../utils/helper'

// For checkbox which state is defined outside of component
// since its state is also used by other components.
export const useCheckboxHost = (checkedFromParent, setParentCheckbox) => {
  const [checkboxHost, setCheckboxHost] = useState({
    checked: false,
    fromParent: true,
  })

  const handleCheckboxHostChange = () => {
    setCheckboxHost(current => ({
      checked: !current.checked,
      fromParent: false,
    }))
  }

  // Synced with parent checkbox state
  useEffect(() => {
    console.log('host - toggle child checkebox from parent')
    setCheckboxHost({
      checked: checkedFromParent,
      fromParent: true,
    })
  }, [checkedFromParent])

  // Update selected state in parent checkbox
  useEffect(() => {
    updateParentCheckbox(
      checkboxHost.checked,
      checkboxHost.fromParent,
      setParentCheckbox
    )
  }, [checkboxHost.checked, checkboxHost.fromParent, setParentCheckbox])

  return [checkboxHost, handleCheckboxHostChange]
}

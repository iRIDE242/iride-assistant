import { useEffect, useState } from 'react'
import { updateParentCheckbox } from '../utils/helper'

// For checkbox which state is defined outside of component
// since its state is also used by other components.
export const useChildCheckboxHost = (checkedFromParent, setParentCheckbox) => {
  const [childCheckboxHost, setChildCheckboxHost] = useState({
    checked: false,
    fromParent: true,
  })

  const handleCheckboxHostChange = () => {
    setChildCheckboxHost(current => ({
      checked: !current.checked,
      fromParent: false,
    }))
  }

  // Synced with parent checkbox state
  useEffect(() => {
    console.log('host - toggle child checkebox from parent')
    setChildCheckboxHost({
      checked: checkedFromParent,
      fromParent: true,
    })
  }, [checkedFromParent])

  // Update selected state in parent checkbox
  useEffect(() => {
    updateParentCheckbox(
      childCheckboxHost.checked,
      childCheckboxHost.fromParent,
      setParentCheckbox
    )
  }, [childCheckboxHost.checked, childCheckboxHost.fromParent, setParentCheckbox])

  return [childCheckboxHost, handleCheckboxHostChange]
}

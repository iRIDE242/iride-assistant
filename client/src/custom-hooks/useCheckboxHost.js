import { useEffect, useState } from 'react'
import { updateParentCheckbox } from '../utils/helper'

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
    console.log('host - toggle child checkebox by parent')
    setCheckboxHost({
      checked: checkedFromParent,
      fromParent: true,
    })
  }, [checkedFromParent])

  // Manipulate the indeterminate state of section and product checkboxes
  useEffect(() => {
    updateParentCheckbox(
      checkboxHost.checked,
      checkboxHost.fromParent,
      setParentCheckbox
    )
  }, [checkboxHost.checked, checkboxHost.fromParent, setParentCheckbox])

  return [checkboxHost, handleCheckboxHostChange]
}

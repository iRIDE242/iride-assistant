import { useEffect, useState } from 'react'
import { updateParentCheckbox } from '../utils/helper'

export default function ChildCheckbox({
  id,
  label,
  checkedFromParent,
  setParentCheckbox,
}) {
  const [childCheckbox, setChildCheckbox] = useState({
    checked: false,
    fromParent: true,
  })

  const handleChange = () => {
    setChildCheckbox(current => ({
      checked: !current.checked,
      fromParent: false,
    }))
  }

  // Sync the state from parent checkbox
  useEffect(() => {
    console.log('toggle child checkebox by parent')
    setChildCheckbox({
      checked: checkedFromParent,
      fromParent: true,
    })
  }, [checkedFromParent])

  // Only responde to the checked change caused by the component handleChange,
  // but not checked change caused by the parent checkbox state sync.
  useEffect(() => {
    updateParentCheckbox(
      childCheckbox.checked,
      childCheckbox.fromParent,
      setParentCheckbox
    )
  }, [childCheckbox.checked, childCheckbox.fromParent, setParentCheckbox])

  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={childCheckbox.checked}
        onChange={handleChange}
      />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

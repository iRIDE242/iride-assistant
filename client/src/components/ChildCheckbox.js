import { useEffect, useState } from 'react'
import { updateParentCheckbox } from '../utils/helper'

export default function ChildCheckbox({
  id,
  label,
  checkedFromParent,
  setParentCheckbox,
  setGrandParentCheckbox,
  fromSection,
}) {
  const [childCheckbox, setChildCheckbox] = useState({
    checked: false,
    fromParent: true,
    fromSection: null,
  })

  const handleChange = () => {
    setChildCheckbox(current => ({
      checked: !current.checked,
      fromParent: false,
      fromSection: current.fromParent === null ? null : false,
    }))
  }

  // Sync the state from parent checkbox
  useEffect(() => {
    console.log('toggle child checkebox by parent')
    setChildCheckbox(current => ({
      checked: checkedFromParent,
      fromParent: true,
      fromSection: fromSection === undefined ? current.fromParent : fromSection,
    }))
  }, [checkedFromParent, fromSection])

  // Only responde to the checked change caused by the component handleChange,
  // but not checked change caused by the parent checkbox state sync.
  useEffect(() => {
    updateParentCheckbox(
      childCheckbox.checked,
      childCheckbox.fromParent,
      setParentCheckbox
    )
  }, [childCheckbox.checked, childCheckbox.fromParent, setParentCheckbox])

  useEffect(() => {
    setGrandParentCheckbox &&
      childCheckbox.fromSection !== null &&
      updateParentCheckbox(
        childCheckbox.checked,
        childCheckbox.fromSection,
        setGrandParentCheckbox
      )
  }, [childCheckbox.checked, childCheckbox.fromSection, setGrandParentCheckbox])

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

import { useChildCheckbox } from 'custom-hooks/useChildCheckbox'

export default function ChildCheckbox({
  id,
  label,
  checkedFromParent,
  setParentCheckbox,
  setGrandParentCheckbox,
  fromSection,
  onChange,
}) {
  const [checkbox, , getCheckboxProps] = useChildCheckbox(
    checkedFromParent,
    setParentCheckbox,
    setGrandParentCheckbox,
    fromSection
  )

  const props = getCheckboxProps({ onChange })

  return (
    <>
      <input type="checkbox" id={id} checked={checkbox.checked} {...props} />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

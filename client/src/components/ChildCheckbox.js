import { useChildCheckbox } from '../custom-hooks/useChildCheckbox'

export default function ChildCheckbox({
  id,
  label,
  checkedFromParent,
  setParentCheckbox,
  setGrandParentCheckbox,
  fromSection,
  onChange,
}) {
  const [childCheckbox, , getChildCheckboxProps] = useChildCheckbox(
    checkedFromParent,
    setParentCheckbox,
    setGrandParentCheckbox,
    fromSection
  )

  const props = getChildCheckboxProps({ onChange })

  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={childCheckbox.checked}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

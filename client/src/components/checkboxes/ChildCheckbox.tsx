import { useChildCheckbox } from 'custom-hooks/useChildCheckbox'
import { ChildCheckboxProps } from './types'

export default function ChildCheckbox({
  id,
  label,
  checkedFromParent,
  setParentCheckbox,
  setGrandParentCheckbox,
  fromSection,
  onChange,
}: ChildCheckboxProps) {
  const [checkbox, , getCheckboxProps] = useChildCheckbox(
    checkedFromParent,
    setParentCheckbox,
    setGrandParentCheckbox,
    fromSection
  )

  const props = getCheckboxProps({
    onChange,
    id,
    type: 'checkbox',
    checked: checkbox.checked,
  })

  return (
    <>
      <input {...props} />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

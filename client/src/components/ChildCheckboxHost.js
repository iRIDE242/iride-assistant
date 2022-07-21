// Only UI ChildCheckbox
// The state is defined outside since it is also used by other components.
export default function ChildCheckboxHost({
  id,
  label,
  checked,
  onChange,
  handleChildCheckboxChange,
}) {
  const handleChange = () => {
    onChange()
    handleChildCheckboxChange()
  }

  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

// Only UI ChildCheckbox
// The state is defined outside since it is also used by other components.
export default function ChildCheckboxHost({
  id,
  label,
  checked,
  onChange, // optional
  handleChildCheckboxChange,
}) {
  const handleChange = () => {
    onChange && onChange()
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

export default function ChildCheckboxHost({
  id,
  label,
  checked,
  onChange,
  setCheckbox,
}) {
  const handleChange = () => {
    onChange()
    setCheckbox(current => ({
      checked: !current.checked,
      fromParent: false,
      fromSection: current.fromSection === null ? null : false,
    }))
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

export default function CheckboxHost({
  id,
  label,
  checked,
  onChange,
  handleCheckboxHostChange,
}) {
  const handleChange = () => {
    onChange()
    handleCheckboxHostChange()
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

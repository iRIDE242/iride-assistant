export default function Checkbox({ id, checked, handleChange, label }) {
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

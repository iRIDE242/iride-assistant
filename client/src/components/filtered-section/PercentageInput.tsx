import { PercentageInputProps } from './types'

// All the PercentageInput are host components
export default function PercentageInput({
  id,
  discountValue,
  handleDiscountChange,
}: PercentageInputProps) {
  return (
    <>
      <label style={{ marginLeft: '4px' }} htmlFor={id}>
        <strong>Discount: </strong>
      </label>
      <input
        id={id}
        style={{ width: '40px' }}
        type="number"
        value={discountValue}
        onChange={handleDiscountChange}
        min="0"
        max="100"
      />
      <span>%</span>
    </>
  )
}

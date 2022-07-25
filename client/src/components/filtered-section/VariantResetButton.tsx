import useReset from 'custom-hooks/useReset'
import { FormEvent } from 'react'
import { VariantResetButtonProps } from './types'

export default function VariantResetButton({
  resetFromSection,
  resetFromProduct,
  originalPriceSetting,
  setPriceSetting,
  children,
}: VariantResetButtonProps) {
  // Monitor reset from section and product separately.
  // This can solve the problem that price setting will be reset twice
  // when the reset comes from product but not section.
  useReset(resetFromSection, originalPriceSetting, setPriceSetting)
  useReset(resetFromProduct, originalPriceSetting, setPriceSetting)

  const resetPriceSetting = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPriceSetting(originalPriceSetting)
  }

  return <button onClick={resetPriceSetting}>{children}</button>
}

import useReset from 'custom-hooks/useReset'
import { FormEvent, useEffect } from 'react'
import { VariantResetButtonProps } from './types'

export default function VariantResetButton({
  resetFromSection,
  resetFromProduct,
}: VariantResetButtonProps) {
  const [currentForSection] = useReset(resetFromSection)
  const resetForProduct = useReset(resetFromProduct)

  const resetPriceSetting = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }

  // For section reset
  useEffect(() => {
    // reset the price
  }, [])

  // For product reset
  useEffect(() => {
    // reset the price
  }, [])

  return <button onClick={resetPriceSetting}>RESET PRICE SETTING</button>
}

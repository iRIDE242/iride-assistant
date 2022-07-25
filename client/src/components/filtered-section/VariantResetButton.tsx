import useReset from 'custom-hooks/useReset'
import { FormEvent } from 'react'
import { VariantResetButtonProps } from './types'

export default function VariantResetButton({
  resetCurrentFromSection,
  resetCurrentFromProduct,
  originalPriceSetting,
  setPriceSetting,
  children,
}: VariantResetButtonProps) {
  useReset(resetCurrentFromSection, originalPriceSetting, setPriceSetting)
  useReset(resetCurrentFromProduct, originalPriceSetting, setPriceSetting)

  const resetPriceSetting = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPriceSetting(originalPriceSetting)
  }

  // For section reset
  // useEffect(() => {
  //   if (resetRefForSection.current !== resetCurrentFromSection)
  //     resetRefForSection.current = resetCurrentFromSection

  //   // reset the price
  //   setPriceSetting(originalPriceSetting)
  // }, [
  //   originalPriceSetting,
  //   resetCurrentFromSection,
  //   resetRefForSection,
  //   setPriceSetting,
  // ])

  // For product reset
  // useEffect(() => {
  //   if (resetRefForProduct.current !== resetCurrentFromProduct)
  //     resetRefForProduct.current = resetCurrentFromProduct

  //   // reset the price
  //   setPriceSetting(originalPriceSetting)
  // }, [
  //   originalPriceSetting,
  //   resetCurrentFromProduct,
  //   resetRefForProduct,
  //   setPriceSetting,
  // ])

  return <button onClick={resetPriceSetting}>{children}</button>
}

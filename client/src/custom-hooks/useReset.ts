import { Dispatch, FormEvent, SetStateAction, useEffect, useRef } from 'react'
import { PriceSettingState } from './types'

export default function useReset(
  resetCurrentFromAbove?: number,
  originalPriceSetting?: PriceSettingState,
  setPriceSetting?: Dispatch<SetStateAction<PriceSettingState>>
) {
  const resetRef = useRef<number>(0)

  const incrementReset = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const currentReset = resetRef.current
    resetRef.current = currentReset + 1
  }

  useEffect(() => {
    if (resetCurrentFromAbove && resetCurrentFromAbove !== resetRef.current) {
      resetRef.current = resetCurrentFromAbove

      if (originalPriceSetting && setPriceSetting)
        setPriceSetting(originalPriceSetting)
    }
  }, [originalPriceSetting, resetCurrentFromAbove, setPriceSetting])

  return [resetRef, incrementReset] as const
}

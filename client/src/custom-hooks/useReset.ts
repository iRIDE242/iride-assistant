import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { PriceSettingState } from './types'

export default function useReset(
  resetFromAbove?: number,
  originalPriceSetting?: PriceSettingState,
  setPriceSetting?: Dispatch<SetStateAction<PriceSettingState>>
) {
  // Here cannot use useRef to replace useState to avoid unnecessary re-rendering.
  // Changing ref current value won't cause compoenent re-rendering.
  // So current value passed as props on child component will not be updated to the latest.
  // https://www.smashingmagazine.com/2020/11/react-useref-hook/
  const [reset, setReset] = useState<number>(0)

  const incrementReset = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setReset(current => current + 1)
  }

  useEffect(() => {
    if (resetFromAbove && resetFromAbove !== reset) {
      setReset(resetFromAbove)

      if (originalPriceSetting && setPriceSetting)
        setPriceSetting(originalPriceSetting)
    }
  }, [originalPriceSetting, reset, resetFromAbove, setPriceSetting])

  return [reset, incrementReset] as const
}

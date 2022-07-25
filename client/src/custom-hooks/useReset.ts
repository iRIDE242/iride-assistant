import { FormEvent, useEffect, useRef } from 'react'

export default function useReset(resetFromAbove?: number) {
  const reset = useRef<number>(0)

  const incrementReset = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const currentReset = reset.current
    reset.current = currentReset + 1
  }

  useEffect(() => {
    if (resetFromAbove && resetFromAbove !== reset.current)
      reset.current = resetFromAbove
  }, [resetFromAbove])

  return [reset.current, incrementReset] as const
}

import React from 'react'
import {
  Blank,
  GetInitialValue,
  LocalStorageKeys,
  UseLocalStorageStateArg,
} from './types'

export default function useLocalStorageState<LocalStorageState>({
  key,
  initialValue = Blank.blank_string,
  methods: { serialize = JSON.stringify, deserialize = JSON.parse } = {},
}: UseLocalStorageStateArg<LocalStorageState>) {
  const [state, setState] = React.useState<
    LocalStorageState | LocalStorageState[] | Blank.blank_string
  >(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    if (valueInLocalStorage) {
      try {
        return deserialize<LocalStorageState>(valueInLocalStorage)
      } catch (error) {
        console.error(error)
        window.localStorage.removeItem(key)
      }
    }
    return typeof initialValue === 'function'
      ? (initialValue as GetInitialValue<LocalStorageState>)()
      : initialValue
  })

  const prevKeyRef = React.useRef<LocalStorageKeys>(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize<LocalStorageState>(state))
  }, [key, state, serialize])

  return [state, setState] as const
}

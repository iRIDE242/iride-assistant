import React, { Dispatch, SetStateAction } from 'react'
import {
  Blank,
  GetInitialValue,
  LocalStorageKeys,
  UseLocalStorageStateArg,
} from './types'

// Overload for default initialValue
export function useLocalStorageState(props: {
  key: LocalStorageKeys
}): readonly [Blank, Dispatch<SetStateAction<Blank>>]

// Overload for initialValue provided
export function useLocalStorageState<LocalStorageState>(
  props: UseLocalStorageStateArg<LocalStorageState>
): readonly [LocalStorageState[], Dispatch<SetStateAction<LocalStorageState[]>>]

// Note, overload cannot use export default
export function useLocalStorageState<LocalStorageState>({
  key,
  initialValue = Blank.blank_string,
  methods: { serialize = JSON.stringify, deserialize = JSON.parse } = {},
}: UseLocalStorageStateArg<LocalStorageState>) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    if (valueInLocalStorage) {
      try {
        return deserialize<LocalStorageState>(
          valueInLocalStorage
        ) as LocalStorageState[]
      } catch (error) {
        console.error(error)
        window.localStorage.removeItem(key)
      }
    }
    return typeof initialValue === 'function'
      ? ((
          initialValue as GetInitialValue<LocalStorageState>
        )() as LocalStorageState[])
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

  return initialValue === Blank.blank_string
    ? ([
        state as Blank.blank_string,
        setState as Dispatch<SetStateAction<Blank>>,
      ] as const)
    : ([
        state as LocalStorageState[],
        setState as Dispatch<SetStateAction<LocalStorageState[]>>,
      ] as const)
}

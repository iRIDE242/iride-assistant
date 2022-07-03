import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Helper function to create context.
 * Will show error if content is out of context.
 */
export function createCtx(providerName, displayName) {
  const ctx = createContext(undefined)

  if (ctx && displayName) {
    ctx.displayName = displayName
  }

  function useCtx(componentName = 'Consumer components') {
    const c = useContext(ctx)
    if (c === undefined)
      throw new Error(
        `${componentName} must be inside ${providerName} with a value`
      )
    return c
  }
  return [useCtx, ctx.Provider]
}

/**
 * Indeterminate checkbox
 */
export const useCheckbox = (checkedFromSection, setSelectedFromSection) => {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  // Synced with section checkbox state
  useEffect(() => {
    setChecked(checkedFromSection)
  }, [checkedFromSection])

  // Manipulate the indeterminate state of section checkbox
  useEffect(() => {
    if (checked) {
      setSelectedFromSection(prev => prev + 1)
    } else {
      setSelectedFromSection(prev => {
        if (!prev) return prev
        return prev - 1
      })
    }
  }, [checked, setSelectedFromSection])

  return [checked, handleChange]
}

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

const incrementSelected = selected => selected + 1
const decrementSelected = selected => {
  if (!selected) return selected
  return selected - 1
}

export const useCheckbox = (
  checkedFromSection,
  setSelectedFromSection,
  checkedFromProduct,
  setSelectedFromProduct
) => {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  // Synced with section checkbox state
  useEffect(() => {
    setChecked(checkedFromSection)
  }, [checkedFromSection])

  // Synced with product checkbox state
  useEffect(() => {
    if (checkedFromProduct) setChecked(checkedFromProduct)
  }, [checkedFromProduct])

  // Manipulate the indeterminate state of section and product checkboxes
  useEffect(() => {
    if (checked) {
      setSelectedFromSection(incrementSelected)
      if (setSelectedFromProduct) setSelectedFromProduct(incrementSelected)
    } else {
      setSelectedFromSection(decrementSelected)
      if (setSelectedFromProduct) setSelectedFromProduct(decrementSelected)
    }
  }, [checked, setSelectedFromProduct, setSelectedFromSection])

  return [checked, handleChange]
}

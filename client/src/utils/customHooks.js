import { createContext, useContext, useEffect, useState } from 'react'
import { getAllFilters } from './filters'
import { mapValueToArray, MODIFIED, NOT_MODIFIED } from './helper'

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
 * Checkbox having indeterminate status
 * This hook only deals with its immedieate parent but not grandparent
 */

// Avoids selected value exceeding the max value.
// Useful when checked is true by default.
export const getIncrementSelected = length => selected =>
  selected + 1 > length ? length : selected + 1

// Avoids selected value going lower than 0.
// Useful when checked is false by default.
export const decrementSelected = selected => {
  if (!selected) return selected
  return selected - 1
}

export const useCheckbox = (
  checkedFromParent,
  setSelectedFromParent,
  selectedMaxValueFromParent,
  checkedFromGrandParent,
  setSelectedFromGrandParent,
  selectedMaxValueFromGrandParent
) => {
  const [checked, setChecked] = useState(checkedFromParent)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  // Synced with parent checkbox state
  useEffect(() => {
    setChecked(checkedFromParent)
  }, [checkedFromParent])

  useEffect(() => {
    if (checkedFromGrandParent !== undefined) setChecked(checkedFromGrandParent)
  }, [checkedFromGrandParent])

  // Manipulate the indeterminate state of section and product checkboxes
  useEffect(() => {
    if (selectedMaxValueFromParent !== undefined) {
      const incrementSelected = getIncrementSelected(selectedMaxValueFromParent)

      if (checked) {
        if (setSelectedFromParent !== undefined)
          setSelectedFromParent(incrementSelected)
      } else {
        if (setSelectedFromParent !== undefined)
          setSelectedFromParent(decrementSelected)
      }
    }

    if (selectedMaxValueFromGrandParent !== undefined) {
      const incrementSelected = getIncrementSelected(
        selectedMaxValueFromGrandParent
      )

      if (checked) {
        if (setSelectedFromGrandParent !== undefined)
          setSelectedFromGrandParent(incrementSelected)
      } else {
        if (setSelectedFromGrandParent !== undefined)
          setSelectedFromGrandParent(decrementSelected)
      }
    }
  }, [
    checked,
    selectedMaxValueFromGrandParent,
    selectedMaxValueFromParent,
    setSelectedFromGrandParent,
    setSelectedFromParent,
  ])

  return [checked, setChecked, handleChange]
}

export const useAnotherCheckbox = (
  checkboxFromParent,
  setCheckboxFromParent
) => {
  const [checked, setChecked] = useState(checkboxFromParent.checked)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  // Synced with parent checkbox state
  useEffect(() => {
    setChecked(checkboxFromParent.checked)
  }, [checkboxFromParent])

  // useEffect(() => {
  //   if(checkedFromGrandParent !== undefined) setChecked(checkedFromGrandParent)
  // }, [checkedFromGrandParent])

  // Manipulate the indeterminate state of section and product checkboxes
  useEffect(() => {
    if (checkboxFromParent.max !== null) {
      // const incrementSelected = getIncrementSelected(checkboxFromParent.max)

      if (checked) {
        if (setCheckboxFromParent !== undefined)
          setCheckboxFromParent(prev => {
            const currentSelected = prev.selected + 1

            if (currentSelected >= prev.max) {
              return {
                ...prev,
                checked: true,
                selected: prev.max,
              }
            } else {
              return {
                ...prev,
                selected: currentSelected,
              }
            }
          })
      } else {
        if (setCheckboxFromParent !== undefined)
          setCheckboxFromParent(prev => {
            const currentSelected = prev.selected - 1

            if (currentSelected < 0) {
              return {
                ...prev,
                checked: false,
                selected: 0,
              }
            } else {
              return {
                ...prev,
                selected: currentSelected,
              }
            }
          })
      }
    }

    // if (selectedMaxValueFromGrandParent !== undefined) {
    //   const incrementSelected = getIncrementSelected(
    //     selectedMaxValueFromGrandParent
    //   )

    //   if (checked) {
    //     if (setSelectedFromGrandParent !== undefined)
    //       setSelectedFromGrandParent(incrementSelected)
    //   } else {
    //     if (setSelectedFromGrandParent !== undefined)
    //       setSelectedFromGrandParent(decrementSelected)
    //   }
    // }
  }, [checkboxFromParent.max, checked, setCheckboxFromParent])

  return [checked, setChecked, handleChange]
}

/**
 * Filtered products
 */
export const useFilteredProducts = (productsMap, filters) => {
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    const products = mapValueToArray(productsMap)
    const filteredProducts = getAllFilters(filters)(products)

    setFilteredProducts(filteredProducts)
  }, [filters, productsMap])

  return [filteredProducts, setFilteredProducts]
}

/**
 * Discount for filtered section (products) and product
 */
export const useDiscount = discountFromAbove => {
  const [discount, setDiscount] = useState({
    state: NOT_MODIFIED,
    value: '',
  })

  useEffect(() => {
    if (discountFromAbove) {
      const { state, value } = discountFromAbove
      if (state === MODIFIED)
        setDiscount({
          state: MODIFIED,
          value,
        })
    }
  }, [discountFromAbove])

  return [discount, setDiscount]
}

/**
 * Reset price
 */
export const useReset = resetFromAbove => {
  const [reset, setReset] = useState(0)

  const resetPriceSetting = e => {
    e.preventDefault()
    setReset(prev => prev + 1)
  }

  useEffect(() => {
    if (resetFromAbove && resetFromAbove !== reset) setReset(resetFromAbove)
  }, [reset, resetFromAbove])

  return [reset, resetPriceSetting]
}

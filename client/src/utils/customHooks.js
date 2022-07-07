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
    if (checkedFromProduct !== undefined) setChecked(checkedFromProduct)
  }, [checkedFromProduct])

  // Manipulate the indeterminate state of section and product checkboxes
  useEffect(() => {
    if (checked) {
      if (setSelectedFromSection !== undefined)
        setSelectedFromSection(incrementSelected)
      if (setSelectedFromProduct !== undefined)
        setSelectedFromProduct(incrementSelected)
    } else {
      if (setSelectedFromSection !== undefined)
        setSelectedFromSection(decrementSelected)
      if (setSelectedFromProduct !== undefined)
        setSelectedFromProduct(decrementSelected)
    }
  }, [checked, setSelectedFromProduct, setSelectedFromSection])

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

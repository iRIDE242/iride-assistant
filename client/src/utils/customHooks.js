import { useEffect, useState } from 'react'
import { getAllFilters } from './filters'
import { mapValueToArray } from './helper'

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

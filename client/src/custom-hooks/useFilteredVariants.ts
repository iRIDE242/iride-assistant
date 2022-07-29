import { Product, Variant } from 'components/types'
import { ProductsState } from 'context/types'
import { useEffect, useState } from 'react'
import { getAllFilters } from 'utils/filters'

export default function useFilteredVariants(
  product: Product,
  filters: ProductsState['filters']
) {
  const [filteredVariants, setFilteredVariants] = useState<Variant[]>([])

  // Get the filtered variants from product.
  // Only run when it is necessary,
  // avoiding effects from not related re-rendering.
  useEffect(() => {
    const filterVariants = getAllFilters(filters, false)
    setFilteredVariants(filterVariants(product.variants))
  }, [filters, product.variants])

  return [filteredVariants] as const
}

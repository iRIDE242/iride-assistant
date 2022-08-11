import { isActive, getHiddenStatus } from './product.action'
import { Product } from 'components/types'
import { HiddenStatus } from './types'

/**
 * Get active products with hidden variants
 */
const getActiveProductsWithHiddenVariants = (products: Product[]) => {
  const activeProducts = products.filter(isActive)

  const activeProductsWithHiddenvariants = []

  for (let index = 0; index < activeProducts.length; index++) {
    getHiddenStatus(activeProducts[index]) === HiddenStatus.HAS_HIDDEN &&
      activeProductsWithHiddenvariants.push(activeProducts[index])
  }

  return activeProductsWithHiddenvariants
}

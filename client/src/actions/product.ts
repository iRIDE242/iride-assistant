import { Product, Variant } from 'components/types'
import { equals, filter, pipe, prop } from 'remeda'
import { isHidden } from './variant'

/**
 * Property requests
 */
export const getVariants = prop<Product, 'variants'>('variants')
const getStatus = prop<Product, 'status'>('status')

/**
 * Composite requests
 */

export const isActive = pipe(getStatus, equals('active'))

export const getHiddens = pipe(getVariants, filter(isHidden))
// Check if there are hidden variants and return text info
export const getHiddenStatus = product => {
  let status = 'no hidden'
  const hiddens = getHiddens(product)

  if (hiddens.length > 0) status = 'has hidden'
  // console.log(`${product.title}: ${status}`)

  return status
}
export const hasHidden = product => {
  const hiddens = getHiddens(product)
  return hiddens.length > 0
}

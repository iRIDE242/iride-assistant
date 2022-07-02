import { equals, filter, pipe, prop } from 'ramda'
import { isHidden } from './variant'

/**
 * Property requests
 */
export const getVariants = prop('variants')
const getStatus = prop('status')

/**
 * Composite requests
 */
export const getHiddens = pipe(getVariants, filter(isHidden))
export const isActive = pipe(getStatus, equals('active'))

// Check if there are hidden variants and return text info
export const getHiddenStatus = product => {
  let status = 'no hidden'
  const hiddens = getHiddens(product)

  if (hiddens.length > 0) status = 'has hidden'
  // console.log(`${product.title}: ${status}`)

  return status
}

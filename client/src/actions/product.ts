import { Product, Status } from 'components/types'
import { HiddenStatus } from './types'
import { isHidden } from './variant'

/**
 * Property requests
 */
// export const getVariants = prop<Product, 'variants'>('variants')
// const getStatus = prop<Product, 'status'>('status')

export const getVariants = (product: Product) => product.variants
export const getStatus = (product: Product) => product.status

/**
 * Composite requests
 */

// export const isActive = pipe(getStatus, equals('active'))
export const isActive = (product: Product) => {
  return getStatus(product) === Status.ACTIVE
}

// export const getHiddens = pipe(getVariants, filter(isHidden))
// // Check if there are hidden variants and return text info
// export const getHiddenStatus = product => {
//   let status = 'no hidden'
//   const hiddens = getHiddens(product)

//   if (hiddens.length > 0) status = 'has hidden'
//   // console.log(`${product.title}: ${status}`)

//   return status
// }
// export const hasHidden = product => {
//   const hiddens = getHiddens(product)
//   return hiddens.length > 0
// }
export const getHiddens = (product: Product) => {
  return getVariants(product).filter(isHidden)
}
// Check if there are hidden variants and return text info
export const getHiddenStatus = (product: Product) => {
  let status: HiddenStatus = HiddenStatus.NO_HIDDEN
  const hiddens = getHiddens(product)

  if (hiddens.length > 0) status = HiddenStatus.HAS_HIDDEN
  // console.log(`${product.title}: ${status}`)

  return status
}
export const hasHidden = (product: Product) => {
  const hiddens = getHiddens(product)
  return hiddens.length > 0
}

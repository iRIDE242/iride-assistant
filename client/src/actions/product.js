import { equals, filter, pipe, prop } from 'ramda'
import { getProductById, resetVariantWeightById } from '../utils/api'
import { isHidden } from './variantAPIs'
import { createSequencedPromises } from '../utils/helper'

/**
 * Properties requests
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

/**
 * Async requests
 */

/**
 * Promise relay for removing hidden status
 */
const createRemoveHiddenStatusRelayByVariantId = variantId => {
  return async (res, rej) => {
    try {
      const { variant } = await resetVariantWeightById(variantId)
      res(variant)
    } catch (error) {
      rej(error)
    }
  }
}

const createGetProductRelayByProductId = productId => {
  return async (res, rej) => {
    try {
      const { product: updatedProduct } = await getProductById(productId)
      res(updatedProduct)
    } catch (error) {
      rej(error)
    }
  }
}

export const removeSelectedHiddenStatus = async (variantIds, productIds) => {
  const variantsPromiseContainer = createSequencedPromises(
    variantIds,
    createRemoveHiddenStatusRelayByVariantId
  )

  try {
    const variants = await Promise.all(variantsPromiseContainer)
    console.log(variants)

    // This promise needs to be after the updating variants action to get the updated products
    const productsPromiseContainer = createSequencedPromises(
      productIds,
      createGetProductRelayByProductId
    )

    const updatedProducts = await Promise.all(productsPromiseContainer)
    return updatedProducts
  } catch (error) {
    throw error
  }
}

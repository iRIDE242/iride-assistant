import { equals, filter, pipe, prop, reduce } from 'ramda'
import {
  getProductById,
  getVariantLocationInventory,
  resetVariantWeightById,
} from '../utils/api'
import { LOCAL_LOCATION_ID } from '../utils/config'
import { getInventoryItemId, isHidden } from './variantAPIs'
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

/**
 * Async requests
 */

/**
 * Get products that are active and locally out of stock
 */

// Create promise relay
const createLocallyNonHiddenInventoryRelayByVariant = variant => {
  if (isHidden(variant)) return false

  const inventoryItemId = getInventoryItemId(variant)

  return async (res, rej) => {
    try {
      const {
        inventory: { inventory_levels },
      } = await getVariantLocationInventory(LOCAL_LOCATION_ID, inventoryItemId)
      const { available } = inventory_levels[0]

      res(available)
    } catch (error) {
      rej(error)
    }
  }
}

// Use relay to create all the variants' promises to check if local non-hidden variants are out of stock
const areLocalNonHiddenOutOfStock = async product => {
  let status = 'in stock'

  const promiseContainer = createSequencedPromises(
    getVariants(product),
    createLocallyNonHiddenInventoryRelayByVariant
  )

  try {
    const inventories = await Promise.all(promiseContainer)

    const processAdd = (acc, cur) => {
      if (cur <= 0 && status === 'in stock')
        status = 'has variants out of stock'
      return acc + cur
    }

    const totalNonHiddensInventory = reduce(processAdd, 0)(inventories)
    // Note, reduce from Ramda needs to give the initial value

    console.log(`${product.title}: ${totalNonHiddensInventory}`)

    if (totalNonHiddensInventory <= 0) status = 'out of stock'
    console.log(status)

    return status
  } catch (error) {
    throw error
  }
}

// Get the results related to locally out of stock products
export const getLocallyOutOfStockProducts = async products => {
  const activeProducts = filter(isActive)(products)

  const activeLocallyOutOfStockProducts = []
  const activeLocallyHavingOutOfStockProducts = []

  try {
    for (let index = 0; index < activeProducts.length; index++) {
      const status = await areLocalNonHiddenOutOfStock(activeProducts[index])

      if (status === 'out of stock')
        activeLocallyOutOfStockProducts.push(activeProducts[index])
      if (status === 'has variants out of stock')
        activeLocallyHavingOutOfStockProducts.push(activeProducts[index])
    }

    return {
      activeLocallyOutOfStockProducts,
      activeLocallyHavingOutOfStockProducts,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Check if there are hidden variants
 * @param {Product Object} product
 * @returns {Boolean}
 */
const getHiddenStatus = product => {
  let status = 'no hidden'
  const hiddens = getHiddens(product)

  if (hiddens.length > 0) status = 'has hidden'
  // console.log(`${product.title}: ${status}`)

  return status
}

/**
 * Get products with hidden variants
 */
export const getProductsWithHiddenVariants = products => {
  const activeProducts = filter(isActive)(products)

  const productsHavingHiddenvariants = []

  for (let index = 0; index < activeProducts.length; index++) {
    getHiddenStatus(activeProducts[index]) === 'has hidden' &&
      productsHavingHiddenvariants.push(activeProducts[index])
  }

  return productsHavingHiddenvariants
}

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

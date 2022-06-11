import { equals, filter, pipe, prop, reduce } from 'ramda'
import { getVariantLocationInventory } from '../utils/api'
import { LOCAL_LOCATION_ID } from '../utils/config'
import { getInventoryItemId, isHidden } from './variantAPIs'
import { createSequencedPromises } from '../utils/helper'

/**
 * Product properties
 */
export const getVariants = prop('variants')
const getStatus = prop('status')

/**
 * Specific requests
 */
const getHiddens = pipe(getVariants, filter(isHidden))
export const isActive = pipe(getStatus, equals('active'))

/**
 * API requests
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

// Use relay to create a promise to check if local non-hidden variants are out of stock
export const areLocalNonHiddensOutOfStock = async product => {
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
    return Promise.reject(error)
  }
}

// Get the result
export const getLocallyOutOfStockProducts = async products => {
  const activeProducts = filter(isActive)(products)

  const activeLocallyOutOfStockProducts = []
  const activeLocallyHavingOutOfStockProducts = []

  try {
    for (let index = 0; index < activeProducts.length; index++) {
      const status = await areLocalNonHiddensOutOfStock(activeProducts[index])

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
    return Promise.reject(error)
  }
}

/**
 * Check if there are hidden variants
 * @param {Product Object} product
 * @returns {Boolean}
 */
export const hasHidden = product => {
  let status = 'no hidden'
  const hiddens = getHiddens(product)

  if (hiddens.length > 0) status = 'has hidden'
  console.log(`${product.title}: ${status}`)

  return status
}

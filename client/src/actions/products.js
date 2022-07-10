import { filter, reduce } from 'ramda'
import { getInventoryItemId, isHidden } from './variant'
import {
  getProductById,
  getVariantLocationInventory,
  resetVariantWeightById,
  updateVariantByData,
} from '../utils/api'
import { LOCAL_LOCATION_ID } from '../utils/config'
import { createSequencedPromises } from '../utils/helper'
import { getVariants, isActive, getHiddens } from './product'

/**
 * Get active products with hidden variants
 */
const getActiveProductsWithHiddenVariants = products => {
  const activeProducts = filter(isActive)(products)

  const activeProductsWithHiddenvariants = []

  for (let index = 0; index < activeProducts.length; index++) {
    getHiddens(activeProducts[index]) === 'has hidden' &&
      activeProductsWithHiddenvariants.push(activeProducts[index])
  }

  return activeProductsWithHiddenvariants
}

/**
 * Get products that are active, and completely or partially out of stock locally
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

// Get the results related to completely or partially locally out of stock products
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
 * Bulky remove hidden status for variants
 */

// Promise relay to remove hidden status for a variant
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

// Promise relay to get a product
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

// Bulky remove hidden status for variants then get the updated products
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

const createUpdateVariantRelayByVariantData = variantData => {
  return async (res, rej) => {
    try {
      const { variant } = await updateVariantByData(variantData)
      res(variant)
    } catch (error) {
      rej(error)
    }
  }
}

export const updateSelectedVariants = async (variantData, productIds) => {
  const variantsPromiseContainer = createSequencedPromises(
    variantData, // variants data array
    createUpdateVariantRelayByVariantData
  )

  try {
    const variants = await Promise.all(variantsPromiseContainer)
    console.log(variants)

    // This promise needs to be after the updating variants action to get the updated products
    // const productsPromiseContainer = createSequencedPromises(
    //   productIds,
    //   createGetProductRelayByProductId
    // )

    // const updatedProducts = await Promise.all(productsPromiseContainer)
    // return updatedProducts

    return true
  } catch (error) {
    throw error
  }
}

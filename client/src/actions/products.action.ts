import { getInventoryItemId, inClearance, isHidden } from './variant.action'
import {
  getProductById,
  getVariantLocationInventory,
  resetVariantWeightById,
  updateVariantByData,
} from '../utils/api'
import { LOCAL_LOCATION_ID } from '../utils/config'
import { createSequencedPromises } from '../utils/helper'
import { getVariants, isActive, getHiddenStatus } from './product.action'
import { Product, Variant } from 'components/types'
import { HiddenStatus, InventoryStatus } from './types'

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

/**
 * Get products that are active, and completely or partially out of stock locally
 */

// Create promise relay
const createNonHiddenOrWithCapLocalInventoryRelayByVariant = async (
  variant: Variant
) => {
  if (isHidden(variant)) return false
  if (!inClearance(variant)) return false

  const inventoryItemId = getInventoryItemId(variant)

  try {
    const {
      inventory: { inventory_levels },
    } = await getVariantLocationInventory(LOCAL_LOCATION_ID, inventoryItemId)
    const { available } = inventory_levels[0]

    return available
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Use relay to create all the variants' promises to check if local non-hidden variants are out of stock
const areLocalNonHiddenOutOfStock = async (product: Product) => {
  let status: InventoryStatus = InventoryStatus.IN_STOCK

  const promiseContainer = createSequencedPromises(
    getVariants(product),
    createNonHiddenOrWithCapLocalInventoryRelayByVariant
  )

  try {
    const inventories = await Promise.all(promiseContainer)

    const processAdd = (acc: number, cur: number) => {
      if (cur <= 0 && status === InventoryStatus.IN_STOCK)
        status = InventoryStatus.PARTIALLY_OUT
      return acc + cur
    }

    const totalNonHiddensInventory = inventories.reduce(processAdd, 0)
    // Note, reduce from Ramda needs to give the initial value

    console.log(`${product.title}: ${totalNonHiddensInventory}`)

    if (totalNonHiddensInventory <= 0) status = InventoryStatus.OUT_OF_STOCK
    console.log(status)

    return status as InventoryStatus
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Get the results related to completely or partially locally out of stock products
export const getLocallyOutOfStockProducts = async (products: Product[]) => {
  const activeProducts = products.filter(isActive)

  const activeLocallyOutOfStockProducts: Product[] = []
  const activeLocallyHavingOutOfStockProducts: Product[] = []

  try {
    for (let index = 0; index < activeProducts.length; index++) {
      const status = await areLocalNonHiddenOutOfStock(activeProducts[index])

      if (status === InventoryStatus.OUT_OF_STOCK)
        activeLocallyOutOfStockProducts.push(activeProducts[index])
      if (status === InventoryStatus.PARTIALLY_OUT)
        activeLocallyHavingOutOfStockProducts.push(activeProducts[index])
    }

    return {
      activeLocallyOutOfStockProducts,
      activeLocallyHavingOutOfStockProducts,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * Bulky remove hidden status for variants
 */

// Promise relay to remove hidden status for a variant
const createRemoveHiddenStatusRelayByVariantId = async (
  variantId: string
): Promise<Variant> => {
  try {
    const { variant } = await resetVariantWeightById(variantId)
    return variant
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Promise relay to get a product
const createGetProductRelayByProductId = async (
  productId: string
): Promise<Product> => {
  try {
    const { product: updatedProduct } = await getProductById(productId)
    return updatedProduct
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Bulky remove hidden status for variants then get the updated products
export const removeSelectedHiddenStatus = async (
  variantIds: Array<Variant['id']>,
  productIds: Array<Product['id']>
): Promise<Product[]> => {
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

/**
 * Update variants
 */
const createUpdateVariantRelayByVariantData = async (
  variantData: Partial<Variant>
): Promise<Variant> => {
  try {
    const { variant } = await updateVariantByData(variantData)
    return variant
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateSelectedVariants = async (
  variantData: Array<Partial<Variant>>,
  productIds: Array<Product['id']>
): Promise<Product[]> => {
  const variantsPromiseContainer = createSequencedPromises(
    variantData, // variants data array
    createUpdateVariantRelayByVariantData
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

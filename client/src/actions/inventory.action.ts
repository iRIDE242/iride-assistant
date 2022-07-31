import { getInventoryItemId, inClearance, isHidden } from './variant.action'
import { getVariantLocationInventory } from '../utils/api'
import { LOCAL_LOCATION_ID } from '../utils/config'
import { createSequencedPromises } from '../utils/helper'
import { getVariants, isActive } from './product.action'
import { Product, Variant } from 'components/types'
import { InventoryStatus } from './types'

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

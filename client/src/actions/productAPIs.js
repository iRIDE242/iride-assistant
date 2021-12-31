import { add, equals, filter, pipe, prop, reduce } from "ramda";
import { getVariantLocationInventory } from "../utils/api";
import { LOCAL_LOCATION_ID } from "../utils/config";
import { getInventoryItemId, isNonHidden } from "./variantAPIs";

/**
 * Product properties
 */
export const getVariants = prop('variants')
const getStatus = prop('status')




/**
 * Specific requests
 */
const getNonHiddens = pipe(getVariants, filter(isNonHidden))
export const isActive = pipe(getStatus, equals('active'))




/**
 * API requests
 */

/**
 * Check if local non-hidden variants are out of stock
 * @param {Product Object} product 
 * @returns {Boolean}
 */
export const areLocalNonHiddensOutOfStock = async product => {
  let promiseContainer = []
  const nonHiddens = getNonHiddens(product)

  for (let index = 0; index < nonHiddens.length; index++) {
    const inventoryItemId = getInventoryItemId(nonHiddens[index])

    promiseContainer = [
      ...promiseContainer,
      new Promise(res => {
        setTimeout(async () => {
          const { objFromShop } = await getVariantLocationInventory(LOCAL_LOCATION_ID, inventoryItemId)

          const { inventory_levels } = objFromShop
          const { available } = inventory_levels[0]
          
          res(available)
        }, 500 * index);
      })
    ]
  }

  const inventories = await Promise.all(promiseContainer)
  const totalNonHiddensInventory = reduce(add, 0)(inventories)
  // Note, reduce from Ramda needs to give the initial value

  console.log(`${product.title}: ${totalNonHiddensInventory}`)

  return totalNonHiddensInventory <= 0
}

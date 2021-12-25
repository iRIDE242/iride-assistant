import { add, filter, pipe, reduce } from "ramda";
import { getVariantLocationInventory } from "../utils/api";
import { LOCAL_LOCATION_ID } from "../utils/config";
import { getProductVariants } from "./productAPIs";
import { getVariantInventoryItemId, isNonHiddenVariant } from "./variantAPIs";

// Product non-hidden variants
const getNonHiddenVariants = filter(isNonHiddenVariant)
export const getProductNonHiddenVariants = pipe(getProductVariants, getNonHiddenVariants)

export const isLocalNonHiddensOutOfStock = async product => {
  let promiseContainer = []
  const productNonHiddenVariants = getProductNonHiddenVariants(product)

  for (let index = 0; index < productNonHiddenVariants.length; index++) {
    const inventoryItemId = getVariantInventoryItemId(productNonHiddenVariants[index])

    promiseContainer = [
      ...promiseContainer,
      new Promise(res => {
        setTimeout(async () => {
          const inventoryRes = await getVariantLocationInventory(LOCAL_LOCATION_ID, inventoryItemId)

          const { objFromShop } = await inventoryRes.json()
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
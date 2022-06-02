import { equals, filter, pipe, prop, reduce } from 'ramda'
import { getVariantLocationInventory } from '../utils/api'
import { LOCAL_LOCATION_ID } from '../utils/config'
import { getInventoryItemId, isHidden, isNonHidden } from './variantAPIs'

/**
 * Product properties
 */
export const getVariants = prop('variants')
const getStatus = prop('status')

/**
 * Specific requests
 */
const getNonHiddens = pipe(getVariants, filter(isNonHidden))
const getHiddens = pipe(getVariants, filter(isHidden))
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
  let status = 'in stock'
  let promiseContainer = []
  const nonHiddens = getNonHiddens(product)

  for (let index = 0; index < nonHiddens.length; index++) {
    const inventoryItemId = getInventoryItemId(nonHiddens[index])

    promiseContainer = [
      ...promiseContainer,
      new Promise(res => {
        setTimeout(async () => {
          const {
            inventory: { inventory_levels },
          } = await getVariantLocationInventory(
            LOCAL_LOCATION_ID,
            inventoryItemId
          )
          const { available } = inventory_levels[0]

          res(available)
        }, 500 * index)
      }),
    ]
  }

  const inventories = await Promise.all(promiseContainer)

  const processAdd = (acc, cur) => {
    if (cur <= 0 && status === 'in stock') status = 'has variants out of stock'
    return acc + cur
  }

  const totalNonHiddensInventory = reduce(processAdd, 0)(inventories)
  // Note, reduce from Ramda needs to give the initial value

  console.log(`${product.title}: ${totalNonHiddensInventory}`)

  if (totalNonHiddensInventory <= 0) status = 'out of stock'
  console.log(status)

  return status
}

/**
 * Check if there are hidden variants
 * @param {Product Object} product
 * @returns {Boolean}
 */
export const hasHidden = async product => {
  let status = 'no hidden'
  const hiddens = getHiddens(product)

  if (hiddens.length > 0) status = 'has hidden'
  console.log(status)

  return status
}

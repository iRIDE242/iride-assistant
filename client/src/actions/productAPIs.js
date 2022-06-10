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

const createSequenceForPromise = (delay, index) => passPromiseParams => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      passPromiseParams(res, rej)
    }, delay * index)
  })
}

const getSequencedPromises = (arr, createPromiseRelay, delaySetting = 500) => {
  const delay = delaySetting < 500 ? 500 : delaySetting

  let promiseContainer = []
  let legidIndex = 0

  for (let index = 0; index < arr.length; index++) {
    const passPromiseParams = createPromiseRelay(arr[index])

    if (!passPromiseParams) continue

    const receiveRelayToPassParams = createSequenceForPromise(delay, legidIndex)
    const sequencedPromise = receiveRelayToPassParams(passPromiseParams)

    promiseContainer.push(sequencedPromise)
    legidIndex++
  }

  return promiseContainer
}

const getLocallyNonHiddenInventoryRelayByVariant = variant => {
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

  const promiseContainer = getSequencedPromises(
    getVariants(product),
    getLocallyNonHiddenInventoryRelayByVariant
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

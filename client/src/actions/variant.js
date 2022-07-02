import { pipe, prop } from 'ramda'

/**
 * Variant properties
 */
const getWeight = prop('weight')
export const getInventoryItemId = prop('inventory_item_id')

/**
 * Specific requests
 */

// Non-hidden variant
const isNot9999 = weight => weight !== 9999
export const isNonHidden = pipe(getWeight, isNot9999)

// Hidden variant
const is9999 = weight => weight === 9999
export const isHidden = pipe(getWeight, is9999)

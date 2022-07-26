import { pipe, prop, equals } from 'ramda'

/**
 * Property requests
 */
const getWeight = prop('weight')
export const getInventoryItemId = prop('inventory_item_id')
export const getCap = prop('compare_at_price')

/**
 * Composite requests
 */

// Non-hidden variant
const isNot9999 = weight => weight !== 9999
export const isNonHidden = pipe(getWeight, isNot9999)

// Hidden variant
const is9999 = weight => weight === 9999
export const isHidden = pipe(getWeight, is9999)

const getOpposite = val => !val
export const inClearance = pipe(getCap, equals(null), getOpposite)

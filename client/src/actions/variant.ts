import { Variant } from 'components/types'
import { pipe, prop, equals, isNot } from 'remeda'

/**
 * Property requests
 */
const getWeight = prop<Variant, 'weight'>('weight')
export const getInventoryItemId = prop<Variant, 'inventory_item_id'>('inventory_item_id')
export const getCap = prop<Variant, 'compare_at_price'>('compare_at_price')

/**
 * Composite requests
 */

// Non-hidden variant
// const isNot9999 = (weight: number) => weight !== 9999
const isNot9999 = isNot(() => 9999)
export const isNonHidden = pipe(getWeight, isNot9999)

// Hidden variant
const is9999 = weight => weight === 9999
export const isHidden = pipe(getWeight, is9999)

const getOpposite = val => !val
export const inClearance = pipe(getCap, equals(null), getOpposite)

import { Variant } from 'components/types'

/**
 * Property requests
 */
// const getWeight = prop<Variant, 'weight'>('weight')
// export const getInventoryItemId = prop<Variant, 'inventory_item_id'>('inventory_item_id')
// export const getCap = prop<Variant, 'compare_at_price'>('compare_at_price')
const getWeight = (variant: Variant) => variant.weight
export const getInventoryItemId = (variant: Variant) =>
  variant.inventory_item_id
export const getCap = (variant: Variant) => variant.compare_at_price

/**
 * Composite requests
 */

// Non-hidden variant
// const isNot9999 = (weight: number) => weight !== 9999
// const isNot9999 = isNot(() => 9999)
// export const isNonHidden = pipe(getWeight, isNot9999)
const weightNot9999 = (weight: number) => weight !== 9999
export const isNonHidden = (variant: Variant) => {
  return weightNot9999(getWeight(variant))
}

// Hidden variant
// const is9999 = weight => weight === 9999
// export const isHidden = pipe(getWeight, is9999)
const weight9999 = (weight: number) => weight === 9999
export const isHidden = (variant: Variant) => {
  return weight9999(getWeight(variant))
}

// const getOpposite = val => !val
// export const inClearance = pipe(getCap, equals(null), getOpposite)
const capNotNull = (cap: Variant['compare_at_price']) => cap !== null
export const inClearance = (variant: Variant) => {
  return capNotNull(getCap(variant))
}

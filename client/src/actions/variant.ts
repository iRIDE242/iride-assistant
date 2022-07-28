import { Variant } from 'components/types'

/**
 * Property requests
 */
const getWeight = (variant: Variant) => variant.weight
export const getInventoryItemId = (variant: Variant) =>
  variant.inventory_item_id
export const getCap = (variant: Variant) => variant.compare_at_price

/**
 * Composite requests
 */
const weightNot9999 = (weight: number) => weight !== 9999
export const isNonHidden = (variant: Variant) => {
  return weightNot9999(getWeight(variant))
}

// Hidden variant
const weight9999 = (weight: number) => weight === 9999
export const isHidden = (variant: Variant) => {
  return weight9999(getWeight(variant))
}

const capNotNull = (cap: Variant['compare_at_price']) => cap !== null
export const inClearance = (variant: Variant) => {
  return capNotNull(getCap(variant))
}

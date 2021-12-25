import { filter, pipe, prop } from "ramda";

/**
 * Get properties
 */
const getVariantWeight = prop('weight')
export const getVariantInventoryItemId = prop('inventory_item_id')




/**
 * Specific requests
 */

// Non-hidden variant
const isNotHidden = weight => weight !== 9999
export const isNonHiddenVariant = pipe(getVariantWeight, isNotHidden)
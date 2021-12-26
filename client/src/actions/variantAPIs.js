import { filter, pipe, prop } from "ramda";

/**
 * Get properties
 */
const getWeight = prop('weight')
export const getInventoryItemId = prop('inventory_item_id')




/**
 * Specific requests
 */

// Non-hidden variant
const isNot9999 = weight => weight !== 9999
export const isNonHidden = pipe(getWeight, isNot9999)
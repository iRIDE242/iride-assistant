import { handleFetch } from './helper'

export const getVariantLocationInventory = (locationIds, inventoryItemIds) => {
  const url = `/inventory?location_ids=${locationIds}&inventory_item_ids=${inventoryItemIds}`
  return handleFetch(url)
}

export const getVariantById = variantId => {
  const url = `/variant?variant_id=${variantId}`
  return handleFetch(url)
}

export const resetVariantWeightById = variantId => {
  const url = `/variant/weight?variant_id=${variantId}`
  return handleFetch(url)
}

export const getProductsByCollectionId = async collectionId => {
  const url = `/products?collection_id=${collectionId}`
  return handleFetch(url)
}

export const getProductsByPageInfo = async ({ limit, pageInfo }) => {
  const url = `/products?limit=${limit}&page_info=${pageInfo}`
  return handleFetch(url)
}

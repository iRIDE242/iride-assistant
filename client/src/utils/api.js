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

export const getProductsByCollectionId = collectionId => {
  const url = `/products?collection_id=${collectionId}`
  return handleFetch(url)
}

export const getProductsByPageInfo = ({ limit, pageInfo }) => {
  const url = `/products?limit=${limit}&page_info=${pageInfo}`
  return handleFetch(url)
}

export const getProductById = productId => {
  const url = `/products?product_id=${productId}`
  return handleFetch(url)
}

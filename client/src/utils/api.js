export const getVariantLocationInventory = async (
  locationIds,
  inventoryItemIds
) => {
  const response = await fetch(
    `/inventory?location_ids=${locationIds}&inventory_item_ids=${inventoryItemIds}`
  )
  return response.json()
}

export const getVariantById = async variantId => {
  const response = await fetch(`/variant?variant_id=${variantId}`)
  return response.json()
}

export const resetVariantWeightById = async variantId => {
  const response = await fetch(`/variant/weight?variant_id=${variantId}`)
  return response.json()
}

export const getProductsByCollectionId = async collectionId => {
  try {
    const response = await fetch(`/products?collection_id=${collectionId}`)
    return response.json()
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getProductsByPageInfo = async ({ limit, pageInfo }) => {
  try {
    const response = await fetch(
      `/products?limit=${limit}&page_info=${pageInfo}`
    )
    return response.json()
  } catch (error) {
    return Promise.reject(error)
  }
}

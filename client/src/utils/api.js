export const getVariantLocationInventory = async (
  locationIds,
  inventoryItemIds
) => {
  try {
    const response = await fetch(
      `/inventory?location_ids=${locationIds}&inventory_item_ids=${inventoryItemIds}`
    )
    return response.json()
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getVariantById = async variantId => {
  try {
    const response = await fetch(`/variant?variant_id=${variantId}`)
    return response.json()
  } catch (error) {
    return Promise.reject(error)
  }
}

export const resetVariantWeightById = async variantId => {
  try {
    const response = await fetch(`/variant/weight?variant_id=${variantId}`)
    return response.json()
  } catch (error) {
    return Promise.reject(error)
  }
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

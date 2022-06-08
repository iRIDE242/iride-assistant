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

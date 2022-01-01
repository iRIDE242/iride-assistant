export const getVariantLocationInventory = async (locationIds, inventoryItemIds) => {
  const response = await fetch(`/inventory?location_ids=${locationIds}&inventory_item_ids=${inventoryItemIds}`)
  return response.json()
}

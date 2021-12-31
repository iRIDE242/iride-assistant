export const getVariantLocationInventory = async (locationId, inventoryItemId) => {
  const response = await fetch(`/inventory?location=${locationId}&item=${inventoryItemId}`)
  return response.json()
}

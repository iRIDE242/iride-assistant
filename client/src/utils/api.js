export function getVariantLocationInventory (locationId, inventoryItemId) {
  return fetch(`/inventory?location=${locationId}&item=${inventoryItemId}`)
}

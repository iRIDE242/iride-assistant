import fetch from 'node-fetch'
import { API_VERSION, options, STORE_NAME } from "../utils/shopifyConfig.js"

export const queryByItemAndLocation = async (inventoryItemIds, locationIds) => {
  const response = await fetch(`https://${STORE_NAME}.myshopify.com/admin/api/${API_VERSION}/inventory_levels.json?inventory_item_ids=${inventoryItemIds}&location_ids=${locationIds}`, options)

  return response.json()
}
import fetch from 'node-fetch'
import { API_VERSION, options, STORE_NAME } from "../utils/shopifyConfig.js"

export const queryByItemAndLocation = async (itemId, locationId) => {
  const response = await fetch(`https://${STORE_NAME}.myshopify.com/admin/api/${API_VERSION}/inventory_levels.json?inventory_item_ids=${itemId}&location_ids=${locationId}`, options)

  return response.json()
}
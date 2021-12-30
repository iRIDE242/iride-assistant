import fetch from 'node-fetch'
import { API_VERSION, options, STORE_NAME } from "../shopifyConfig.js"

export const getByItemAndLocation = async (itemId, locationId) => {
  const response = await fetch(`https://${STORE_NAME}.myshopify.com/admin/api/${API_VERSION}/inventory_levels.json?inventory_item_ids=${itemId}&location_ids=${locationId}`, options)

  return response.json()
}
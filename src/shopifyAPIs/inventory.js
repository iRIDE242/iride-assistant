import fetch from 'node-fetch'
import { OPTIONS_GET, BASE_REQUEST_URL } from '../utils/shopifyConfig.js'

const INVENTORY_REQUEST_URL = `${BASE_REQUEST_URL}inventory_levels.json`

export const queryByItemAndLocation = async (inventoryItemIds, locationIds) => {
  const response = await fetch(
    `${INVENTORY_REQUEST_URL}?inventory_item_ids=${inventoryItemIds}&location_ids=${locationIds}`,
    OPTIONS_GET
  )

  return response.json()
}

import { handleFetch } from '../utils/functions.js'
import { OPTIONS_GET, BASE_REQUEST_URL } from '../utils/shopifyConfig.js'

const INVENTORY_REQUEST_URL = `${BASE_REQUEST_URL}inventory_levels.json`

export const queryByItemAndLocation = (inventoryItemIds, locationIds) => {
  const url = `${INVENTORY_REQUEST_URL}?inventory_item_ids=${inventoryItemIds}&location_ids=${locationIds}`
  return handleFetch(url, OPTIONS_GET)
}

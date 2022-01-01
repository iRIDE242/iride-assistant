import debugModule from 'debug'
import { queryByItemAndLocation } from '../shopifyAPIs/inventory.js'

const debug = debugModule('app: inventoryController')

export const inventoryController = () => {
  const getByItemAndLocation = async (req, res) => {
    const inventoryItemIds = req.query.inventory_item_ids
    const locationIds = req.query.location_ids

    try {
      const inventory = await queryByItemAndLocation(inventoryItemIds, locationIds)
      // debug(inventory)
      
      res.send({ inventory })
    } catch (error) {
      debug(error)
    }
  }

  return {
    getByItemAndLocation
  }
}

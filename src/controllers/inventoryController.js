import debugModule from 'debug'
import { queryByItemAndLocation } from '../shopifyAPIs/inventory.js'

const debug = debugModule('app: inventoryController')

export const inventoryController = () => {
  const getByItemAndLocation = async (req, res, next) => {
    const inventoryItemIds = req.query.inventory_item_ids
    const locationIds = req.query.location_ids

    try {
      const { result } = await queryByItemAndLocation(
        inventoryItemIds,
        locationIds
      )
      // debug(inventory)

      res.send({ inventory: result })
    } catch (error) {
      debug('IN ERROR')
      debug(error)

      // Send to handle error middleware
      next(error)
    }
  }

  return {
    getByItemAndLocation,
  }
}

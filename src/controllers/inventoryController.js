import debugModule from 'debug'
import { queryByItemAndLocation } from '../shopifyAPIs/inventory.js'

const debug = debugModule('app: inventoryController')

export const inventoryController = () => {
  const getByItemAndLocation = async (req, res) => {
    const itemId = req.query.item
    const locationId = req.query.location

    try {
      const inventory = await queryByItemAndLocation(itemId, locationId)
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

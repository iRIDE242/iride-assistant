import debugModule from 'debug'
import { queryByVariantId } from '../shopifyAPIs/variant.js'

const debug = debugModule('app: variantController')

export const variantController = () => {
  const getByVariantId = async (req, res) => {
    const variantId = req.query.variant_id

    try {
      const variant = await queryByVariantId(variantId)
      debug(variant)

      res.send(variant)
    } catch (error) {
      debug(error)
    }
  }

  return {
    getByVariantId,
  }
}

import debugModule from 'debug'
import { queryByVariantId, updateByVariantId } from '../shopifyAPIs/variant.js'

const debug = debugModule('app: variantController')

export const variantController = () => {
  const getByVariantId = async (req, res) => {
    const variantId = req.query.variant_id

    try {
      const { result } = await queryByVariantId(variantId)
      debug(`Getting variant ${variantId} done.`)

      res.send(result)
    } catch (error) {
      debug('IN ERROR')
      debug(error)

      // Send to handle error middleware
      next(error)
    }
  }

  const resetWeightByVariantId = async (req, res, next) => {
    const variantId = req.query.variant_id

    const data = {
      variant: {
        id: variantId,
        weight: 0,
      },
    }

    try {
      const { result } = await updateByVariantId(variantId, data)
      debug(`The weight of variant ${variantId} has been reset to 0.`)

      res.send(result)
    } catch (error) {
      debug('IN ERROR')
      debug(error)

      // Send to handle error middleware
      next(error)
    }
  }

  const updateByVariantData = async (req, res, next) => {
    // const variantId = req.query.variant_id
    // debug(req)
    const variantData = req.body
    debug(variantData)

    // const data = {
    //   variant: {
    //     id: variantId,
    //     weight: 0,
    //   },
    // }

    try {
      // const { result } = await updateByVariantId(variantId, data)
      debug(`The variant has been updated.`)

      res.send('result')
    } catch (error) {
      debug('IN ERROR')
      debug(error)

      // Send to handle error middleware
      next(error)
    }
  }

  return {
    getByVariantId,
    resetWeightByVariantId,
    updateByVariantData
  }
}

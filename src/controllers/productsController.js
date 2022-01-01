import debugModule from 'debug'
import { prop } from 'ramda'
import { queryByCollection } from '../shopifyAPIs/products.js'
import { getQueryCollection } from '../utils/functions.js'

const debug = debugModule('app: productsController')

export const productsController = () => {
  const middleware = (req, res, next) => {
    if (getQueryCollection(req)) {
      const collectionId = getQueryCollection(req)
      debug(`collectionId: ${collectionId}`)

      req.queryFunc = () => queryByCollection(collectionId)
      next()
    }
  }

  const getProductsAndResponseHeader = async (req, res) => {
    try {
      const queryFunc = prop('queryFunc')(req)

      // queryFunc's return is not a promise, but includes promise inside.
      // So it still needs 'await' to get the result from the promise.
      const { responseHeaders, products } = await queryFunc()
      debug('Succeeded getting products and response header')
      // debug(responseHeaders)
      // debug(products)

      res.send({
        products,
        responseHeaders
      })
    } catch (error) {
      debug(error)
    }
  }

  return {
    middleware,
    getProductsAndResponseHeader
  }
}
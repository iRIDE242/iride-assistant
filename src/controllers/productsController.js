import debugModule from 'debug'
import { prop } from 'ramda'
import { queryByCollectionId } from '../shopifyAPIs/products.js'
import { getQueryCollectionId } from '../utils/functions.js'

const debug = debugModule('app: productsController')

export const productsController = () => {
  const middleware = (req, res, next) => {
    if (getQueryCollectionId(req)) {
      const collectionId = getQueryCollectionId(req)
      debug(`collectionId: ${collectionId}`)

      req.queryFunc = () => queryByCollectionId(collectionId)
      next()
    }
  }

  const getProductsAndResponseHeader = async (req, res) => {
    try {
      const queryFunc = prop('queryFunc')(req)

      // queryFunc's return is not a promise, but includes promise inside.
      // So it still needs 'await' to get the result from the promise.
      const { responseHeaders, products: { products }} = await queryFunc()
      debug('Succeeded getting products and response header')
      debug(responseHeaders)
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
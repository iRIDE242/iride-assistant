import debugModule from 'debug'
import { prop } from 'ramda'
import { queryByCollectionId } from '../shopifyAPIs/products.js'
import { getQueryCollectionId, handleHeaders } from '../utils/functions.js'

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

      // queryFunc's return is a promise,
      // So it needs 'await' to get the result from the promise.
      const { responseHeaders, products: { products }} = await queryFunc()
      debug('Succeeded getting products and response header')
      // debug(products)

      // The original headers is not normal object, 
      // need to be formatted into the readable object.
      const headerObj = handleHeaders(responseHeaders)
      // debug(headerObj)

      res.send({
        products,
        headerObj
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
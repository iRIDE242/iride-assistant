import debugModule from 'debug'
import { prop } from 'ramda'
import {
  queryByCollectionId,
  queryByPageInfo,
} from '../shopifyAPIs/products.js'
import {
  getQueryCollectionId,
  getQueryLimit,
  getQueryPageInfo,
  handleHeaders,
} from '../utils/functions.js'

const debug = debugModule('app: productsController')

export const productsController = () => {
  const middleware = (req, res, next) => {
    if (getQueryCollectionId(req)) {
      const collectionId = getQueryCollectionId(req)
      debug(`Collection ID: ${collectionId}`)

      req.queryFunc = () => queryByCollectionId(collectionId)
      next()
    }

    if (getQueryPageInfo(req)) {
      const pageInfo = getQueryPageInfo(req)
      const limit = getQueryLimit(req)
      debug(`Page info: ${pageInfo}`)

      req.queryFunc = () => queryByPageInfo(limit, pageInfo)
      next()
    }
  }

  const getProductsAndResponseHeader = async (req, res, next) => {
    try {
      const queryFunc = prop('queryFunc')(req)

      // queryFunc's return is a promise,
      // So it needs 'await' to get the result from the promise.
      const {
        response: { headers },
        result: { products },
      } = await queryFunc()
      debug('Succeeded getting products and response header')
      // debug(products)

      // The original headers is not normal object,
      // need to be formatted into the readable object.
      const headerObj = handleHeaders(headers)
      // debug(headerObj)

      res.send({
        products,
        headerObj,
      })
    } catch (error) {
      debug('IN ERROR')
      debug(error)

      // Send to handle error middleware
      next(error)
    }
  }

  return {
    middleware,
    getProductsAndResponseHeader,
  }
}

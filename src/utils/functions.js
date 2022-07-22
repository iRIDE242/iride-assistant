import { pipe, prop } from 'ramda'
import debugModule from 'debug'
import fetch from 'node-fetch'

const debug = debugModule('app: functions')

const getQuery = prop('query')
const getCollectionId = prop('collection_id')
const getPageInfo = prop('page_info')
const getLimit = prop('limit')
const getProductId = prop('product_id')

export const getQueryCollectionId = pipe(getQuery, getCollectionId)
export const getQueryPageInfo = pipe(getQuery, getPageInfo)
export const getQueryLimit = pipe(getQuery, getLimit)
export const getQueryProductId = pipe(getQuery, getProductId)

export const handleHeaders = headers => {
  const headerObj = {}
  for (var pair of headers.entries()) {
    headerObj[pair[0]] = pair[1]
  }
  return headerObj
}

export const getRequestOptions = (method, data) => {
  const body = data ? JSON.stringify(data) : null
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.API_SECRET_KEY,
  }

  const baseRequest = {
    method,
    headers,
  }

  return body ? { ...baseRequest, body } : baseRequest
}

export const handleFetch = async (url, options) => {
  try {
    const response = await fetch(url, options)
    const result = await response.json()

    // Handle all the errors except network errors
    if (!response.ok) {
      const error = new Error(result.errors)
      error.status = response.status

      throw error
    }

    return { result, response }
  } catch (error) {
    throw error
  }
}

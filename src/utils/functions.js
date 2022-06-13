import { pipe, prop } from 'ramda'
import debugModule from 'debug'

const debug = debugModule('app: functions')

const getQuery = prop('query')
const getCollectionId = prop('collection_id')
const getPageInfo = prop('page_info')
const getLimit = prop('limit')

export const getQueryCollectionId = pipe(getQuery, getCollectionId)
export const getQueryPageInfo = pipe(getQuery, getPageInfo)
export const getQueryLimit = pipe(getQuery, getLimit)

export const handleHeaders = headers => {
  const headerObj = {}
  for (var pair of headers.entries()) {
    headerObj[pair[0]] = pair[1]
  }
  return headerObj
}

export const getRequestOptions = (method, data) => {
  const body = data ? JSON.stringify(data) : null
  const header = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.API_SECRET_KEY,
  }

  const baseRequest = {
    method,
    header,
  }

  return body ? { ...baseRequest, body } : baseRequest
}

export const getFetchReturn = (response, jsonResponse) => {
  if (response.ok) {
    return jsonResponse
  } else {
    // The parameter in reject method needs to be an Error object
    const error = new Error(jsonResponse.errors)
    error.status = response.status

    // Note, promise reject won't lead to an error. It is just a normal return.
    return Promise.reject(error)
  }
}

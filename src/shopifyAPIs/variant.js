import debugModule from 'debug'
import { getRequestOptions, handleFetch } from '../utils/functions.js'
import { OPTIONS_GET, BASE_REQUEST_URL } from '../utils/shopifyConfig.js'

const debug = debugModule('app: variantAPI')

const createUrl = variantId => `${BASE_REQUEST_URL}variants/${variantId}.json`

export const queryByVariantId = variantId => {
  return handleFetch(createUrl(variantId), OPTIONS_GET)
}

export const updateByVariantId = (variantId, data) => {
  const options = getRequestOptions('PUT', data)
  return handleFetch(createUrl(variantId), options)
}

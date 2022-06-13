import debugModule from 'debug'
import fetch from 'node-fetch'
import { getRequestOptions, handleFetch } from '../utils/functions.js'
import { OPTIONS_GET, BASE_REQUEST_URL } from '../utils/shopifyConfig.js'

const debug = debugModule('app: variantAPI')

const createUrl = variantId => `${BASE_REQUEST_URL}variants/${variantId}.json`

export const queryByVariantId = async variantId => {
  const response = await fetch(createUrl(variantId), OPTIONS_GET)

  return response.json()
}

export const updateByVariantId = (variantId, data) => {
  const options = getRequestOptions('PUT', data)
  return handleFetch(createUrl(variantId), options)
}

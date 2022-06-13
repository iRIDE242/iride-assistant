import debugModule from 'debug'
import fetch from 'node-fetch'
import { getRequestOptions, handleFetch } from '../utils/functions.js'
import { OPTIONS_GET, BASE_REQUEST_URL } from '../utils/shopifyConfig.js'

const debug = debugModule('app: variantAPI')

const createVariantRequestUrl = variantId =>
  `${BASE_REQUEST_URL}variants/${variantId}.json`

export const queryByVariantId = async variantId => {
  const response = await fetch(createVariantRequestUrl(variantId), OPTIONS_GET)

  return response.json()
}

export const updateByVariantId = async (variantId, data) => {
  const options = getRequestOptions('PUT', data)
  const url = createVariantRequestUrl(variantId)

  try {
    const result = await handleFetch(url, options)
    return result
  } catch (error) {
    debug('IN ERROR')
    debug(error)
    throw error
  }
}

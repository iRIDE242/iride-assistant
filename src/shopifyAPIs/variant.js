import debugModule from 'debug'
import fetch from 'node-fetch'
import { getFetchReturn, getRequestOptions } from '../utils/functions.js'
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

  try {
    const response = await fetch(createVariantRequestUrl(variantId), options)
    const jsonResponse = await response.json()

    // When the return is not valid, it will be a promise reject. Promise reject won't lead to an error, but just a normal return. So it will stick to try, but not fall into catch.
    const fetchReturn = getFetchReturn(response, jsonResponse)

    return fetchReturn
  } catch (error) {
    debug('in error')
    debug(error)
    throw error
  }
}

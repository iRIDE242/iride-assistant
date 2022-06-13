import fetch from 'node-fetch'
import { handleFetch } from '../utils/functions.js'
import { OPTIONS_GET, BASE_REQUEST_URL } from '../utils/shopifyConfig.js'

const PRODUCT_REQUEST_URL = `${BASE_REQUEST_URL}products.json`

export const queryProducts = async () => {
  const response = await fetch(PRODUCT_REQUEST_URL, OPTIONS_GET)
  return response.json()
}

export const queryByCollectionId = collectionId => {
  const url = `${PRODUCT_REQUEST_URL}?collection_id=${collectionId}`
  return handleFetch(url, OPTIONS_GET)
}

export const queryByPageInfo = (limit, pageInfo) => {
  const url = `${PRODUCT_REQUEST_URL}?limit=${limit}&page_info=${pageInfo}`
  return handleFetch(url, OPTIONS_GET)
}

import fetch from 'node-fetch'
import { OPTIONS_GET, BASE_REQUEST_URL } from '../utils/shopifyConfig.js'

const PRODUCT_REQUEST_URL = `${BASE_REQUEST_URL}products.json`

export const queryProducts = async () => {
  const response = await fetch(PRODUCT_REQUEST_URL, OPTIONS_GET)
  return response.json()
}

export const queryByCollectionId = async collectionId => {
  const response = await fetch(
    `${PRODUCT_REQUEST_URL}?collection_id=${collectionId}`,
    OPTIONS_GET
  )
  const products = await response.json()

  // The return looks like an simple object.
  // But the whole function is a promise,
  // so the return from this function will be a promise too,
  // no matter whatever the format of its return looks like.
  return {
    responseHeaders: response.headers,
    products,
  }
}

export const queryByPageInfo = async (limit, pageInfo) => {
  const response = await fetch(
    `${PRODUCT_REQUEST_URL}?limit=${limit}&page_info=${pageInfo}`,
    OPTIONS_GET
  )
  const products = await response.json()

  return {
    responseHeaders: response.headers,
    products,
  }
}

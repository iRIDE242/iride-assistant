import fetch from 'node-fetch'
import { options, BASE_REQUEST_URL } from '../utils/shopifyConfig.js'

const createVariantRequestUrl = variantId =>
  `${BASE_REQUEST_URL}variants/${variantId}.json`

export const queryByVariantId = async variantId => {
  const response = await fetch(createVariantRequestUrl(variantId), options)

  return response.json()
}

export const updateByVariantId = async (variantId, data) => {
  const response = await fetch(createVariantRequestUrl(variantId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.API_SECRET_KEY,
    },
    body: JSON.stringify(data),
  })

  return response.json()
}

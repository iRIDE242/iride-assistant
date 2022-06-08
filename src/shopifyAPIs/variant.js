import fetch from 'node-fetch'
import { API_VERSION, options, STORE_NAME } from '../utils/shopifyConfig.js'

export const queryByVariantId = async variantId => {
  const response = await fetch(
    `https://${STORE_NAME}.myshopify.com/admin/api/${API_VERSION}/variants/${variantId}.json`,
    options
  )

  return response.json()
}

export const updateByVariantId = async (variantId, data) => {
  const response = await fetch(
    `https://${STORE_NAME}.myshopify.com/admin/api/${API_VERSION}/variants/${variantId}.json`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.API_SECRET_KEY,
      },
      body: JSON.stringify(data),
    }
  )

  return response.json()
}

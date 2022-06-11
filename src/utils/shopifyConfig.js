import dotenv from 'dotenv'

dotenv.config()

export const STORE_NAME = 'iride-store'
export const API_VERSION = '2022-01'
export const BASE_REQUEST_URL = `https://${STORE_NAME}.myshopify.com/admin/api/${API_VERSION}/`

export const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.API_SECRET_KEY
  }
}
import {
  getProductById,
  resetVariantWeightById,
  updateVariantByData,
} from '../utils/api'
import { Product, Variant } from 'components/types'
import { createSequencedPromises } from './helper'

/**
 * Bulky remove hidden status for variants
 */

// Promise relay to remove hidden status for a variant
const createRemoveHiddenStatusPromiseByVariantId = async (
  variantId: number
): Promise<Variant> => {
  try {
    const { variant } = await resetVariantWeightById(variantId)
    return variant
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Promise relay to get a product
const createGetProductPromiseByProductId = async (
  productId: number
): Promise<Product> => {
  try {
    const { product: updatedProduct } = await getProductById(productId)
    return updatedProduct
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Bulky remove hidden status for variants then get the updated products
export const removeSelectedHiddenStatus = async (
  variantIds: Array<Variant['id']>,
  productIds: Array<Product['id']>
): Promise<Product[]> => {
  const variantsPromiseContainer = createSequencedPromises(
    variantIds,
    createRemoveHiddenStatusPromiseByVariantId
  )

  try {
    const variants = await Promise.all(variantsPromiseContainer)
    console.log(variants)

    // This promise needs to be after the updating variants action to get the updated products
    const productsPromiseContainer = createSequencedPromises(
      productIds,
      createGetProductPromiseByProductId
    )

    const updatedProducts = await Promise.all(productsPromiseContainer)
    return updatedProducts
  } catch (error) {
    throw error
  }
}

/**
 * Update variants
 */
const createUpdateVariantPromiseByVariantData = async (
  variantData: Partial<Variant>
): Promise<Variant> => {
  try {
    const { variant } = await updateVariantByData(variantData)
    return variant
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateSelectedVariants = async (
  variantData: Array<Partial<Variant>>,
  productIds: Array<Product['id']>
): Promise<Product[]> => {
  const variantsPromiseContainer = createSequencedPromises(
    variantData, // variants data array
    createUpdateVariantPromiseByVariantData
  )

  try {
    const variants = await Promise.all(variantsPromiseContainer)
    console.log(variants)

    // This promise needs to be after the updating variants action to get the updated products
    const productsPromiseContainer = createSequencedPromises(
      productIds,
      createGetProductPromiseByProductId
    )

    const updatedProducts = await Promise.all(productsPromiseContainer)
    return updatedProducts
  } catch (error) {
    throw error
  }
}

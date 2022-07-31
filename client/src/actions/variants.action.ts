import {
  getProductById,
  resetVariantWeightById,
  updateVariantByData,
} from '../utils/api'
import { createSequencedPromises } from '../utils/helper'
import { Product, Variant } from 'components/types'

/**
 * Bulky remove hidden status for variants
 */

// Promise relay to remove hidden status for a variant
const createRemoveHiddenStatusRelayByVariantId = async (
  variantId: string
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
const createGetProductRelayByProductId = async (
  productId: string
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
    createRemoveHiddenStatusRelayByVariantId
  )

  try {
    const variants = await Promise.all(variantsPromiseContainer)
    console.log(variants)

    // This promise needs to be after the updating variants action to get the updated products
    const productsPromiseContainer = createSequencedPromises(
      productIds,
      createGetProductRelayByProductId
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
const createUpdateVariantRelayByVariantData = async (
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
    createUpdateVariantRelayByVariantData
  )

  try {
    const variants = await Promise.all(variantsPromiseContainer)
    console.log(variants)

    // This promise needs to be after the updating variants action to get the updated products
    const productsPromiseContainer = createSequencedPromises(
      productIds,
      createGetProductRelayByProductId
    )

    const updatedProducts = await Promise.all(productsPromiseContainer)
    return updatedProducts
  } catch (error) {
    throw error
  }
}

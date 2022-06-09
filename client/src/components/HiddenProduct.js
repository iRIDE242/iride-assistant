import { getVariantById, resetVariantWeightById } from '../utils/api'
import HiddenVariant from './HiddenVariant'

export default function HiddenProduct({ product }) {
  const handleGetVariant = variantId => async e => {
    e.preventDefault()
    console.log(variantId)
    const variant = await getVariantById(variantId)
    console.log(variant)
  }

  const handleResetWeight = variantId => async e => {
    e.preventDefault()
    const variant = await resetVariantWeightById(variantId)
    console.log(variant)
  }

  return (
    <>
      <h3>{product.title}</h3>
      <ul>
        {product.variants.map(
          variant =>
            variant.weight === 9999 && (
              <li key={variant.id}>
                <HiddenVariant product={product} variant={variant} />
                <button onClick={handleGetVariant(variant.id)}>
                  GET VARIANT
                </button>
                <button onClick={handleResetWeight(variant.id)}>
                  RESET WEIGHT
                </button>
              </li>
            )
        )}
      </ul>
    </>
  )
}

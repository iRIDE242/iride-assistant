import { useEffect, useState } from 'react'
import {
  getProductById,
  getVariantById,
  resetVariantWeightById,
} from '../utils/api'
import HiddenVariant from './HiddenVariant'

export default function ProductWithHidden({
  product,
  checked: checkedFromInfo,
}) {
  const [checked, setChecked] = useState(false)

  const handleGetVariant = variantId => async e => {
    e.preventDefault()
    console.log(variantId)
    try {
      const variant = await getVariantById(variantId)
      console.log(variant)

      console.log(product.id)
      const updatedProduct = await getProductById(product.id)
      console.log(updatedProduct)
    } catch (error) {
      throw error
    }
  }

  const handleResetWeight = variantId => async e => {
    e.preventDefault()
    try {
      const variant = await resetVariantWeightById(variantId)
      console.log(variant)
    } catch (error) {
      throw error
    }
  }

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  useEffect(() => {
    setChecked(checkedFromInfo)
  }, [checkedFromInfo])

  return (
    <>
      <input
        type="checkbox"
        id={`hidden-product-${product.id}`}
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={`hidden-product-${product.id}`}>
        <h3 style={{ display: 'inline-block' }}>{product.title}</h3>
      </label>
      <ul>
        {product.variants.map(
          variant =>
            variant.weight === 9999 && (
              <li key={variant.id}>
                <HiddenVariant
                  product={product}
                  variant={variant}
                  checkedFromProduct={checked}
                  checkedFromInfo={checkedFromInfo}
                />
                <button onClick={handleGetVariant(variant.id)}>
                  GET VARIANT
                </button>
                <button onClick={handleResetWeight(variant.id)}>
                  SHOW VARIANT
                </button>
              </li>
            )
        )}
      </ul>
    </>
  )
}

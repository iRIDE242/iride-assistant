import { useEffect, useRef, useState } from 'react'
import {
  getProductById,
  getVariantById,
  resetVariantWeightById,
} from '../utils/api'
import HiddenVariant from './HiddenVariant'
import { isHidden } from '../actions/variantAPIs'

export default function ProductWithHidden({
  product,
  checked: checkedFromInfo,
}) {
  const [checked, setChecked] = useState(false)
  const [hiddenVariants, setHiddenVariants] = useState([])
  const [selected, setSelected] = useState(0)

  const inputRef = useRef()

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

  useEffect(() => {
    setHiddenVariants(product.variants.filter(isHidden))
  }, [product.variants])

  useEffect(() => {
    if (!selected) {
      setChecked(false)
      inputRef.current.indeterminate = false
    }

    if (selected > 0 && selected < hiddenVariants.length)
      inputRef.current.indeterminate = true

    if (selected === hiddenVariants.length) {
      setChecked(true)
      inputRef.current.indeterminate = false
    }
  }, [hiddenVariants.length, selected])

  return (
    <>
      <input
        type="checkbox"
        id={`hidden-product-${product.id}`}
        checked={checked}
        ref={inputRef}
        onChange={handleChange}
      />
      <label htmlFor={`hidden-product-${product.id}`}>
        <h3 style={{ display: 'inline-block' }}>{product.title}</h3>
      </label>

      {hiddenVariants.length > 0 && (
        <ul>
          {hiddenVariants.map(variant => (
            <li key={variant.id}>
              <HiddenVariant
                product={product}
                variant={variant}
                checkedFromProduct={checked}
                checkedFromInfo={checkedFromInfo}
                setSelected={setSelected}
              />
              <button onClick={handleGetVariant(variant.id)}>
                GET VARIANT
              </button>
              <button onClick={handleResetWeight(variant.id)}>
                SHOW VARIANT
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

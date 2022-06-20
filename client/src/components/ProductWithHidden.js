import { useEffect, useState } from 'react'
import {
  getProductById,
  getVariantById,
  resetVariantWeightById,
} from '../utils/api'
import HiddenVariant from './HiddenVariant'
import { isHidden } from '../actions/variantAPIs'
import TitleCheckbox from './TitleCheckbox'

export default function ProductWithHidden({
  product,
  checked: checkedFromInfo,
  setSelected: setSelectedFromAbove,
}) {
  const [checked, setChecked] = useState(false)
  const [hiddenVariants, setHiddenVariants] = useState([])
  const [selected, setSelected] = useState(0)

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

  useEffect(() => {
    setChecked(checkedFromInfo)
  }, [checkedFromInfo])

  useEffect(() => {
    setHiddenVariants(product.variants.filter(isHidden))
  }, [product.variants])

  return (
    <>
      <TitleCheckbox
        selected={selected}
        length={hiddenVariants.length}
        checked={checked}
        setChecked={setChecked}
        inputId={`hidden-product-${product.id}`}
        inputTitle={product.title}
        headerSize="h3"
      />

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
                setSelectedFromAbove={setSelectedFromAbove}
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

import { useEffect, useState } from 'react'
import {
  getProductById,
  getVariantById,
  resetVariantWeightById,
} from '../utils/api'
import HiddenVariant from './HiddenVariant'
import TitleCheckbox from './TitleCheckbox'
import { updateProduct, useProducts } from '../context/products'
import CopyButton from './CopyButton'
import CopyHint from './CopyHint'
import { getAllFilters } from '../utils/filters'

export default function ProductWithHidden({
  product,
  checked: checkedFromSection,
  setSelected: setSelectedFromAbove,
}) {
  const [checked, setChecked] = useState(false)
  const [hiddenVariants, setHiddenVariants] = useState([])
  const [selected, setSelected] = useState(0)
  const [isCopied, setIsCopied] = useState(false)

  const [{ filters }, dispatch] = useProducts()

  const handleGetVariant = variantId => async e => {
    e.preventDefault()
    console.log(variantId)
    try {
      const variant = await getVariantById(variantId)
      console.log(variant)
    } catch (error) {
      throw error
    }
  }

  const handleResetWeight = variantId => async e => {
    e.preventDefault()

    const li = document.querySelector(`#variant-${variantId}`)
    li.style.display = 'none'

    try {
      const variant = await resetVariantWeightById(variantId)
      console.log(variant)

      console.log(product.id)
      const { product: updatedProduct } = await getProductById(product.id)
      console.log(updatedProduct)

      updateProduct(dispatch, updatedProduct)
    } catch (error) {
      li.style.display = 'list-item'
      throw error
    }
  }

  // Keep synced with section checkbox
  useEffect(() => {
    setChecked(checkedFromSection)
  }, [checkedFromSection])

  // Get the filtered products from all the products
  useEffect(() => {
    const filterVariants = getAllFilters(filters, false)
    setHiddenVariants(filterVariants(product.variants))
  }, [filters, product.variants])

  return (
    <div>
      <TitleCheckbox
        selected={selected}
        length={hiddenVariants.length}
        checked={checked}
        setChecked={setChecked}
        inputId={`hidden-product-${product.id}`}
        inputTitle={product.title}
        headerSize="h3"
      />
      <CopyButton title={product.title} setIsCopied={setIsCopied} />
      <CopyHint isCopied={isCopied} />

      {hiddenVariants.length > 0 && (
        <ul>
          {hiddenVariants.map(variant => (
            <li key={variant.id} id={`variant-${variant.id}`}>
              <HiddenVariant
                product={product}
                variant={variant}
                checkedFromProduct={checked}
                checkedFromSection={checkedFromSection}
                setSelected={setSelected}
                setSelectedFromAbove={setSelectedFromAbove}
              />
              <button onClick={handleGetVariant(variant.id)}>
                GET VARIANT
              </button>
              {filters.hiddenVariants.status && (
                <button onClick={handleResetWeight(variant.id)}>
                  REMOVE HIDDEN STATUS
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import {
  getProductById,
  getVariantById,
  resetVariantWeightById,
} from '../../utils/api'
import FilteredVariant from './FilteredVariant'
import TitleCheckbox from '../TitleCheckbox'
import { updateProduct, useProducts } from '../../context/products'
import CopyButton from '../CopyButton'
import CopyHint from '../CopyHint'
import { getAllFilters } from '../../utils/filters'

export default function FilteredProduct({
  product,
  checked: checkedFromSection,
  setSelected: setSelectedFromSection,
}) {
  const [checked, setChecked] = useState(false)
  const [filteredVariants, setFilteredVariants] = useState([])
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

  // Get the filtered variants from product
  useEffect(() => {
    const filterVariants = getAllFilters(filters, false)
    setFilteredVariants(filterVariants(product.variants))
  }, [filters, product.variants])

  return (
    <div>
      <TitleCheckbox
        selected={selected}
        length={filteredVariants.length}
        checked={checked}
        setChecked={setChecked}
        inputId={`hidden-product-${product.id}`}
        inputTitle={product.title}
        headerSize="h3"
      />
      <CopyButton title={product.title} setIsCopied={setIsCopied} />
      <CopyHint isCopied={isCopied} />

      {filteredVariants.length > 0 && (
        <ul>
          {filteredVariants.map(variant => (
            <li key={variant.id} id={`variant-${variant.id}`}>
              <FilteredVariant
                product={product}
                variant={variant}
                checkedFromProduct={checked}
                checkedFromSection={checkedFromSection}
                setSelectedFromProduct={setSelected}
                setSelectedFromSection={setSelectedFromSection}
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

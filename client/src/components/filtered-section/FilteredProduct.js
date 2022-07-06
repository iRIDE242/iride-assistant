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
import { useCheckbox } from '../../utils/customHooks'
import { idGroups, idRoles } from '../../utils/config'

export default function FilteredProduct({
  product,
  checked: checkedFromSection,
  setSelected: setSelectedFromSection,
  showVariants: showVariantsFromSection,
  setSelectedChildren,
}) {
  const [filteredVariants, setFilteredVariants] = useState([])
  const [selected, setSelected] = useState(0)
  const [isCopied, setIsCopied] = useState(false)

  // Title checkbox
  const [checked, setChecked] = useCheckbox(checkedFromSection)

  // Show variants checkbox
  const [showVariants, , handleShowVariants] = useCheckbox(
    showVariantsFromSection,
    setSelectedChildren
  )

  const [discount, setDiscount] = useState('')

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

  const handleSetDiscount = e => {
    setDiscount(e.target.value)
  }

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
        inputId={`${idGroups.filteredProducts}--${idRoles.product}-${product.id}`}
        inputTitle={product.title}
        headerSize="h3"
      />

      <input
        type="checkbox"
        id={`${idGroups.showVariants}--${idRoles.product}-${product.id}`}
        checked={showVariants}
        onChange={handleShowVariants}
      />
      <label
        htmlFor={`${idGroups.showVariants}--${idRoles.product}-${product.id}`}
      >
        Show variants
      </label>

      <label
        style={{ marginLeft: '4px' }}
        htmlFor={`${idGroups.setPrice}--${idRoles.product}-${product.id}`}
      >
        <strong>Discount: </strong>
      </label>
      <input
        id={`${idGroups.setPrice}--${idRoles.product}-${product.id}`}
        style={{ width: '40px' }}
        type="number"
        value={discount}
        onChange={handleSetDiscount}
        min="0"
        max="100"
      />
      <span>%</span>

      <CopyButton title={product.title} setIsCopied={setIsCopied} />
      <CopyHint isCopied={isCopied} />

      {filteredVariants.length > 0 && (
        <ul style={{ display: showVariants ? 'unset' : 'none' }}>
          {filteredVariants.map(variant => (
            <li key={variant.id} id={`variant-${variant.id}`}>
              <FilteredVariant
                product={product}
                variant={variant}
                checkedFromProduct={checked}
                checkedFromSection={checkedFromSection}
                setSelectedFromProduct={setSelected}
                setSelectedFromSection={setSelectedFromSection}
                discountFromProduct={discount}
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

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
import { useCheckbox, useDiscount } from '../../utils/customHooks'
import { idGroups, idRoles } from '../../utils/config'
import { handleDiscountValue, MODIFIED } from '../../utils/helper'

export default function FilteredProduct({
  product,
  checked: checkedFromSection,
  setSelected: setSelectedFromSection,
  showVariants: showVariantsFromSection,
  setSelectedChildren,
  discountFromSection,
  resetFromSection,
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

  const [discount, setDiscount] = useDiscount(discountFromSection)

  // Here cannot use useRef to replace useState to avoid unnecessary re-rendering
  // since the ref version of reset that is needed to pass down to children
  // will cause shallow copy issue that won't affect its children.
  // https://www.smashingmagazine.com/2020/11/react-useref-hook/
  const [reset, setReset] = useState(0)

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
    setDiscount({
      state: MODIFIED,
      value: handleDiscountValue(e.target.value),
    })
  }

  const resetPriceSetting = e => {
    e.preventDefault()
    setReset(prev => prev + 1)
  }

  // Get the filtered variants from product
  useEffect(() => {
    const filterVariants = getAllFilters(filters, false)
    setFilteredVariants(filterVariants(product.variants))
  }, [filters, product.variants])

  useEffect(() => {
    if (resetFromSection !== reset) setReset(resetFromSection)
  }, [reset, resetFromSection])

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
        value={discount.value}
        onChange={handleSetDiscount}
        min="0"
        max="100"
      />
      <span>%</span>

      <button onClick={resetPriceSetting}>RESET PRICE SETTING</button>

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
                resetFromProduct={reset}
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

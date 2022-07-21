import { useEffect, useState } from 'react'
import { getProductById, resetVariantWeightById } from '../../utils/api'
import FilteredVariant from './FilteredVariant'
import { updateProduct, useProducts } from '../../context/products'
import CopyButton from '../CopyButton'
import CopyHint from '../CopyHint'
import { getAllFilters } from '../../utils/filters'
import { useReset } from '../../utils/customHooks'
import { idGroups, idRoles } from '../../utils/config'
import { toggleBlock } from '../../utils/helper'
import ParentCheckbox from '../ParentCheckbox'
import { useChildCheckbox } from '../../custom-hooks/useChildCheckbox'
import ChildCheckboxHost from '../ChildCheckboxHost'
import { KEEP_VALUE, useDiscount } from '../../custom-hooks/useDiscount'

export default function FilteredProduct({
  product,
  checked: checkedFromSection,
  setCheckbox: setCheckboxFromSection,
  discountFromSection,
  resetFromSection,
  showVariants: showVariantsFromParent,
  setShowVariants,
  selectedOnly: selectedOnlyFromParent,
  setSelectedOnly,
}) {
  const [{ filters }, dispatch] = useProducts()

  const [filteredVariants, setFilteredVariants] = useState([])

  const [isCopied, setIsCopied] = useState(false)

  // Product checkbox
  // Note, this checkbox won't handle selected from its direct parent, but leave it to variant.
  const [checkbox, setCheckbox] = useState(() => ({
    max: getAllFilters(filters, false)(product.variants).length,
    checked: false,
    selected: 0,
    fromSection: true, // For updating selected from variant
  }))

  const [showVariants, toggleShowVariants] = useChildCheckbox(
    showVariantsFromParent.checked,
    setShowVariants
  )

  const [selectedOnly, toggleSelectedOnly] = useChildCheckbox(
    selectedOnlyFromParent.checked,
    setSelectedOnly
  )

  const [discount, handleSetDiscount, setDiscount] =
    useDiscount(discountFromSection)

  // Here cannot use useRef to replace useState to avoid unnecessary re-rendering
  // since the ref version of reset that is needed to pass down to children
  // will cause shallow copy issue that won't affect its children.
  // https://www.smashingmagazine.com/2020/11/react-useref-hook/
  const [reset, resetPriceSetting] = useReset(resetFromSection)

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

  const keepDiscountValue = () => {
    setDiscount(current => ({
      ...current,
      state: KEEP_VALUE,
    }))
  }

  // Get the filtered variants from product
  useEffect(() => {
    const filterVariants = getAllFilters(filters, false)
    setFilteredVariants(filterVariants(product.variants))
  }, [filters, product.variants])

  // Sync with products checkbox
  useEffect(() => {
    setCheckbox(current => ({
      ...current,
      checked: checkedFromSection,
      selected: checkedFromSection ? current.max : 0,
      fromSection: true,
    }))
  }, [checkedFromSection])

  return (
    <div className="product--wrapper">
      <div>
        {/* Product checkbox */}
        <ParentCheckbox
          parentCheckbox={checkbox}
          setParentCheckbox={setCheckbox}
          onChange={keepDiscountValue}
          inputId={`${idGroups.filteredProducts}--${idRoles.product}-${product.id}`}
          inputTitle={product.title}
          headerSize="h3"
        />

        {/* Show variants child */}
        <ChildCheckboxHost
          id={`${idGroups.showVariants}--${idRoles.product}-${product.id}`}
          label="Show variants"
          checked={showVariants.checked}
          handleChildCheckboxChange={toggleShowVariants}
        />

        <CopyButton title={product.title} setIsCopied={setIsCopied} />
        <CopyHint isCopied={isCopied} />
      </div>

      <div style={toggleBlock(showVariants.checked)}>
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

        {/* Selected only child */}
        <ChildCheckboxHost
          id={`${idGroups.setPrice}--${idRoles.selectedOnly}-${product.id}`}
          label="Select only"
          checked={selectedOnly.checked}
          onChange={keepDiscountValue}
          handleChildCheckboxChange={toggleSelectedOnly}
        />
      </div>

      {filteredVariants.length > 0 && (
        <ul
          style={{
            display: showVariants.checked ? 'unset' : 'none',
            listStyle: 'none',
          }}
        >
          {filteredVariants.map(variant => (
            <li
              key={variant.id}
              id={`variant-${variant.id}`}
              className="product--li"
            >
              <FilteredVariant
                product={product}
                variant={variant}
                checkedFromProduct={checkbox.checked}
                fromSection={checkbox.fromSection}
                setCheckboxFromProduct={setCheckbox}
                setCheckboxFromSection={setCheckboxFromSection}
                discountFromProduct={discount}
                resetFromProduct={reset}
                isSelectedOnly={selectedOnly.checked}
                setDiscount={setDiscount}
              />

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

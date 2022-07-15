import { useEffect, useState } from 'react'
import { getProductById, resetVariantWeightById } from '../../utils/api'
import FilteredVariant from './FilteredVariant'
import TitleCheckbox from '../TitleCheckbox'
import { updateProduct, useProducts } from '../../context/products'
import CopyButton from '../CopyButton'
import CopyHint from '../CopyHint'
import { getAllFilters } from '../../utils/filters'
import {
  useAnotherCheckbox,
  useCheckbox,
  useDiscount,
  useReset,
} from '../../utils/customHooks'
import { idGroups, idRoles } from '../../utils/config'
import { handleDiscountValue, MODIFIED, toggleBlock } from '../../utils/helper'

export default function FilteredProduct({
  product,
  checked: checkedFromSection,
  setSelected: setSelectedFromSection,
  showVariants: showVariantsFromSection,
  setSelectedChildren,
  onlySelected: onlySelectedFromsection,
  setOnlySelectedChildren,
  discountFromSection,
  resetFromSection,
  variantsCounts,
  filteredProductsLength,
  selectedOnlyTest,
  setSelectedOnlyTest,
}) {
  const [filteredVariants, setFilteredVariants] = useState([])
  const [selected, setSelected] = useState(0)
  const [isCopied, setIsCopied] = useState(false)
  // const [onlySelected, setOnlySelected] = useState(true)

  // Title checkbox
  // Note, this checkbox won't handle selected from its direct parent, but leave it to variant.
  const [checked, setChecked] = useCheckbox(checkedFromSection)

  // Show variants checkbox
  const [showVariants, , handleShowVariants] = useCheckbox(
    showVariantsFromSection,
    setSelectedChildren,
    filteredProductsLength
  )

  const [onlySelected, , handleOnlySelected] = useCheckbox(
    onlySelectedFromsection,
    setOnlySelectedChildren,
    filteredProductsLength
  )

  const [selectedOnly, , handleSelectedOnly] = useAnotherCheckbox(selectedOnlyTest, setSelectedOnlyTest)

  const [discount, setDiscount] = useDiscount(discountFromSection)

  // Here cannot use useRef to replace useState to avoid unnecessary re-rendering
  // since the ref version of reset that is needed to pass down to children
  // will cause shallow copy issue that won't affect its children.
  // https://www.smashingmagazine.com/2020/11/react-useref-hook/
  const [reset, resetPriceSetting] = useReset(resetFromSection)

  const [{ filters }, dispatch] = useProducts()

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

  // Get the filtered variants from product
  useEffect(() => {
    const filterVariants = getAllFilters(filters, false)
    setFilteredVariants(filterVariants(product.variants))
  }, [filters, product.variants])

  return (
    <div className="product--wrapper">
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

        <CopyButton title={product.title} setIsCopied={setIsCopied} />
        <CopyHint isCopied={isCopied} />
      </div>

      <div style={toggleBlock(showVariants)}>
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

        <input
          type="checkbox"
          id={`${idGroups.setPrice}--${idRoles.onlySelected}-${product.id}`}
          checked={onlySelected}
          onChange={handleOnlySelected}
        />
        <label
          htmlFor={`${idGroups.setPrice}--${idRoles.onlySelected}-${product.id}`}
        >
          Only selected
        </label>

        <input
          type="checkbox"
          id={`${idGroups.setPrice}--testtest-${product.id}`}
          checked={selectedOnly}
          onChange={handleSelectedOnly}
        />
        <label
          htmlFor={`${idGroups.setPrice}--testtest-${product.id}`}
        >
          Select Only
        </label>
      </div>

      {filteredVariants.length > 0 && (
        <ul
          style={{
            display: showVariants ? 'unset' : 'none',
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
                checkedFromProduct={checked}
                setSelectedFromProduct={setSelected}
                setSelectedFromSection={setSelectedFromSection}
                discountFromProduct={discount}
                resetFromProduct={reset}
                selectedLengthFromProduct={filteredVariants.length}
                variantsCounts={variantsCounts}
                checkedFromSection={checkedFromSection}
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

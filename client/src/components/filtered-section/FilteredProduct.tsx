import { FormEvent, useState } from 'react'
import { getProductById, resetVariantWeightById } from '../../utils/api'
import FilteredVariant from './FilteredVariant'
import { updateProduct, useProducts } from '../../context/products.context'
import CopyButton from '../CopyButton'
import CopyHint from '../CopyHint'
import { getAllFilters } from '../../utils/filters'
import { idGroups, idRoles } from '../../utils/config'
import { toggleBlock } from '../../utils/helper'
import { useChildCheckbox } from '../../custom-hooks/useChildCheckbox'
import { useDiscount } from '../../custom-hooks/useDiscount'
import ParentCheckbox from 'components/checkboxes/ParentCheckbox'
import ChildCheckboxHost from 'components/checkboxes/ChildCheckboxHost'
import useReset from 'custom-hooks/useReset'
import { FilteredProductProps } from './types'
import { Variant } from 'components/types'
import useParentCheckbox from 'custom-hooks/useParentCheckbox'
import useFilteredVariants from 'custom-hooks/useFilteredVariants'
import PercentageInput from './PercentageInput'

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
}: FilteredProductProps) {
  const [{ filters }, dispatch] = useProducts()

  // Product checkbox
  // Note, this checkbox won't handle selected from its direct parent, but leave it to variant.
  const [checkbox, setCheckbox] = useParentCheckbox(
    () => ({
      max: getAllFilters(filters, false)(product.variants).length,
      checked: false,
      selected: 0,
      fromSection: true, // For updating selected from variant
    }),
    checkedFromSection
  )

  const [filteredVariants] = useFilteredVariants(product, filters)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [showVariants, toggleShowVariants] = useChildCheckbox(
    showVariantsFromParent.checked,
    setShowVariants
  )
  const [selectedOnly, toggleSelectedOnly] = useChildCheckbox(
    selectedOnlyFromParent.checked,
    setSelectedOnly
  )
  const [discount, setDiscount, handleDiscountChange, keepDiscountValue] =
    useDiscount(discountFromSection)
  const [reset, incrementReset] = useReset()

  const handleResetWeight =
    (variantId: Variant['id']) => async (e: FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      const li = document.querySelector(
        `#variant-${variantId}`
      ) as HTMLLIElement

      if (li) {
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
    }

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
          handleCheckboxChange={toggleShowVariants}
        />

        <CopyButton title={product.title} setIsCopied={setIsCopied} />
        <CopyHint isCopied={isCopied} />
      </div>

      <div style={toggleBlock(showVariants.checked)}>
        <PercentageInput
          id={`${idGroups.setPrice}--${idRoles.product}-${product.id}`}
          discountValue={discount.value}
          handleDiscountChange={handleDiscountChange}
        />

        <button onClick={incrementReset}>RESET PRICE SETTING</button>

        {/* Selected only child */}
        <ChildCheckboxHost
          id={`${idGroups.setPrice}--${idRoles.selectedOnly}-${product.id}`}
          label="Select only"
          checked={selectedOnly.checked}
          onChange={keepDiscountValue}
          handleCheckboxChange={toggleSelectedOnly}
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
                fromSection={checkbox.fromSection as boolean}
                setCheckboxFromProduct={setCheckbox}
                setCheckboxFromSection={setCheckboxFromSection}
                discountFromProduct={discount}
                resetFromSection={resetFromSection}
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

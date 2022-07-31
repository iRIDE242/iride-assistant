import { FormEvent, useEffect, useState } from 'react'
import FilteredProduct from './FilteredProduct'
import {
  removeSelectedHiddenStatus,
  updateSelectedVariants,
} from '../../actions/products'
import { updateProducts, useProducts } from '../../context/products.context'
import { collections, idGroups, idRoles } from '../../utils/config'
import { getAllFilters } from '../../utils/filters'
import { useDiscount } from '../../custom-hooks/useDiscount'
import ParentCheckbox from 'components/checkboxes/ParentCheckbox'
import useReset from 'custom-hooks/useReset'
import PercentageInput from './PercentageInput'
import {
  FilteredProductsProps,
  ParentCheckboxState,
  ToggleVariantsActions,
} from './types'
import { Collections } from 'utils/types'
import { Product, Variant } from 'components/types'
import { HeaderSizes } from 'components/checkboxes/types'
import {
  bulkyVisuallyToggleVariants,
  productInputRegex,
  replacer,
  variantHandlerRegex,
} from './helpers/filteredProducts.helper'

export default function FilteredProducts({
  filteredProducts,
  settings: { background, mainColor },
  collectionId,
}: FilteredProductsProps) {
  const [checkbox, setCheckbox] = useState<ParentCheckboxState>({
    max: 0,
    checked: false,
    selected: 0,
  })

  const [showVariants, setShowVariants] = useState<ParentCheckboxState>({
    max: 0,
    checked: false,
    selected: 0,
  })

  const [selectedOnly, setSelectedOnly] = useState<ParentCheckboxState>({
    max: 0,
    checked: false,
    selected: 0,
  })

  const [discount, , handleDiscountChange, keepDiscountValue] = useDiscount()

  const [reset, incrementReset] = useReset()

  const [{ filters }, dispatch] = useProducts()

  const inputTitle = `${(collections as Collections)[
    collectionId
  ].name.toUpperCase()} [Counts: 
  ${filteredProducts.length}]`

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const variantIds: Variant['id'][] = []
    const productIds: Product['id'][] = []

    for (let index = 0; index < e.currentTarget.length; index++) {
      const checkbox = e.currentTarget[index] as HTMLInputElement

      if (
        checkbox.nodeName === 'INPUT' &&
        (checkbox.checked || checkbox.indeterminate === true)
      ) {
        if (variantHandlerRegex.test(checkbox.id)) {
          variantIds.push(Number(checkbox.id))
        } else if (productInputRegex.test(checkbox.id)) {
          productIds.push(
            Number(checkbox.id.replace(productInputRegex, replacer))
          )
        }
      }
    }

    bulkyVisuallyToggleVariants(variantIds, ToggleVariantsActions.REMOVE)

    try {
      const updatedProducts = await removeSelectedHiddenStatus(
        variantIds,
        productIds
      )
      updateProducts(dispatch, updatedProducts)
    } catch (error) {
      bulkyVisuallyToggleVariants(variantIds, ToggleVariantsActions.RESUME)
      console.log(error)
    }
  }

  const handleTestSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const variantData: Array<Partial<Variant>> = []
    const productIds: Product['id'][] = []

    for (let index = 0; index < e.currentTarget.length; index++) {
      const checkbox = e.currentTarget[index] as HTMLInputElement

      if (
        checkbox.nodeName === 'INPUT' &&
        (checkbox.checked || checkbox.indeterminate === true)
      ) {
        if (variantHandlerRegex.test(checkbox.id)) {
          const id = checkbox.id.replace(variantHandlerRegex, replacer)
          const form = e.currentTarget as unknown as HTMLFormElement

          const cap = (
            form.querySelector(
              `#${idGroups.variant}--${idRoles.cap}-${id}`
            ) as HTMLInputElement
          ).value
          const price = (
            form.querySelector(
              `#${idGroups.variant}--${idRoles.price}-${id}`
            ) as HTMLInputElement
          ).value

          const data: Partial<Variant> = {
            id: Number(id),
            compare_at_price: cap ? cap : null,
            price,
          }
          variantData.push(data)
        } else if (productInputRegex.test(checkbox.id)) {
          const productId = Number(
            checkbox.id.replace(productInputRegex, replacer)
          )
          productIds.push(productId)
        }
      }
    }

    try {
      const updatedProducts = await updateSelectedVariants(
        variantData,
        productIds
      )
      updateProducts(dispatch, updatedProducts)
    } catch (error) {
      console.log(error)
    }
  }

  // Component effect
  // Calculate the length of filtered variants
  // only when filteredProducts and filters changes,
  // avoiding re-calculate it every re-rendering
  useEffect(() => {
    let filteredVariants: Variant[] = []
    const filterVariants = getAllFilters(filters, false)

    for (let index = 0; index < filteredProducts.length; index++) {
      filteredVariants = [
        ...filteredVariants,
        ...filterVariants(filteredProducts[index].variants),
      ]
    }

    setCheckbox(current => ({
      ...current,
      max: filteredVariants.length,
    }))

    setShowVariants({
      max: filteredProducts.length,
      checked: true,
      selected: filteredProducts.length,
    })

    setSelectedOnly({
      max: filteredProducts.length,
      checked: true,
      selected: filteredProducts.length,
    })
  }, [filteredProducts, filters])

  return (
    <div style={{ background: background }} className="products-wrapper">
      <div>
        {/* Products checkbox */}
        <ParentCheckbox
          parentCheckbox={checkbox}
          setParentCheckbox={setCheckbox}
          onChange={keepDiscountValue}
          inputId={`${idGroups.filteredProducts}--${idRoles.section}-${collectionId}`}
          inputTitle={inputTitle}
          headerSize={HeaderSizes.H2}
        />

        {/* Show variants parent */}
        <ParentCheckbox
          parentCheckbox={showVariants}
          setParentCheckbox={setShowVariants}
          inputId={`${idGroups.showVariants}--${idRoles.section}-${collectionId}`}
          inputTitle="Show variants"
        />

        {/* Select only parent */}
        <ParentCheckbox
          parentCheckbox={selectedOnly}
          setParentCheckbox={setSelectedOnly}
          onChange={keepDiscountValue}
          inputId={`${idGroups.setPrice}--${idRoles.section}-${collectionId}`}
          inputTitle="Selected only"
        />
      </div>

      <div>
        <PercentageInput
          id={`${idGroups.setPrice}--${idRoles.section}`}
          discountValue={discount.value}
          handleDiscountChange={handleDiscountChange}
        />

        <button onClick={incrementReset}>RESET PRICE SETTING</button>
      </div>

      <div style={{ color: mainColor }} className="products--form-wrapper">
        <form
          onSubmit={
            filters.hiddenVariants.status ? handleSubmit : handleTestSubmit
          }
        >
          {filteredProducts.map(product => (
            <FilteredProduct
              key={product.id}
              product={product}
              checked={checkbox.checked}
              setCheckbox={setCheckbox}
              discountFromSection={discount}
              resetFromSection={reset}
              showVariants={showVariants}
              setShowVariants={setShowVariants}
              selectedOnly={selectedOnly}
              setSelectedOnly={setSelectedOnly}
            />
          ))}
          {filters.hiddenVariants.status && (
            <button type="submit">
              REMOVE HIDDEN STATUS FROM ALL SELECTED
            </button>
          )}

          {!filters.hiddenVariants.status && (
            <button type="submit">UPDATE SELECTED PRICE</button>
          )}
        </form>
      </div>
    </div>
  )
}

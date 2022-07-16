import { useEffect, useState } from 'react'
import FilteredProduct from './FilteredProduct'
import {
  removeSelectedHiddenStatus,
  updateSelectedVariants,
} from '../../actions/products'
import { handleDiscountValue, MODIFIED } from '../../utils/helper'
import TitleCheckbox from '../TitleCheckbox'
import { updateProducts, useProducts } from '../../context/products'
import { collections, idGroups, idRoles } from '../../utils/config'
import { getAllFilters } from '../../utils/filters'
import { useDiscount, useReset } from '../../utils/customHooks'
import ParentCheckbox from '../ParentCheckbox'

const variantHandlerRegex = new RegExp(
  `${idGroups.variant}--${idRoles.handler}-(\\d+)` // Variant handler checkbox
)
const productInputRegex = new RegExp(
  `${idGroups.filteredProducts}--${idRoles.product}-(\\d+)` // Product checkbox
)
const replacer = (match, p1) => p1

const bulkyVisuallyToggleVariants = (variantIds, action) => {
  for (let index = 0; index < variantIds.length; index++) {
    const li = document.querySelector(`#variant-${variantIds[index]}`)
    action === 'remove'
      ? (li.style.display = 'none')
      : (li.style.display = 'list-item')
  }
}

export default function FilteredProducts({
  filteredProducts,
  settings: { background, mainColor },
  collectionId,
}) {
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState(0)
  const [variantsCounts, setVariantsCounts] = useState(0)

  const [showVariants, setShowVariants] = useState(false)
  const [selectedChildren, setSelectedChildren] = useState(0)

  const [onlySelected, setOnlySelected] = useState(false)
  const [onlySelectedChildren, setOnlySelectedChildren] = useState(0)

  const [selectedOnly, setSelectedOnly] = useState({
    max: 0,
    checked: false,
    selected: 0,
  })

  const [discount, setDiscount] = useDiscount()

  const [reset, resetPriceSetting] = useReset()

  const [{ filters }, dispatch] = useProducts()

  const inputTitle = `${collections[collectionId].name.toUpperCase()} [Counts: 
  ${filteredProducts.length}]`

  const handleSubmit = async e => {
    e.preventDefault()

    const variantIds = []
    const productIds = []

    for (let index = 0; index < e.target.length; index++) {
      if (
        e.target[index].nodeName === 'INPUT' &&
        (e.target[index].checked || e.target[index].indeterminate === true)
      ) {
        if (variantHandlerRegex.test(e.target[index].id)) {
          variantIds.push(e.target[index].id)
        } else if (productInputRegex.test(e.target[index].id)) {
          productIds.push(
            e.target[index].id.replace(productInputRegex, replacer)
          )
        }
      }
    }

    bulkyVisuallyToggleVariants(variantIds, 'remove')

    try {
      const updatedProducts = await removeSelectedHiddenStatus(
        variantIds,
        productIds
      )
      updateProducts(dispatch, updatedProducts)
    } catch (error) {
      bulkyVisuallyToggleVariants(variantIds, 'resume')
      console.log(error)
    }
  }

  const handleTestSubmit = async e => {
    e.preventDefault()

    const variantData = []
    const productIds = []

    for (let index = 0; index < e.target.length; index++) {
      if (
        e.target[index].nodeName === 'INPUT' &&
        (e.target[index].checked || e.target[index].indeterminate === true)
      ) {
        if (variantHandlerRegex.test(e.target[index].id)) {
          const id = e.target[index].id.replace(variantHandlerRegex, replacer)

          const cap = e.target.querySelector(
            `#${idGroups.variant}--${idRoles.cap}-${id}`
          ).value
          const price = e.target.querySelector(
            `#${idGroups.variant}--${idRoles.price}-${id}`
          ).value

          const data = {
            id,
            compare_at_price: cap ? cap : null,
            price,
          }
          variantData.push(data)
        } else if (productInputRegex.test(e.target[index].id)) {
          productIds.push(
            e.target[index].id.replace(productInputRegex, replacer)
          )
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

  const handleSetDiscount = e => {
    // Number input will only responde legid inputs (number or blank space '')
    // Illegal inputs will only trigger the event once when input converts from legid to illegal state,
    // and the event value will be a blank space ''.
    // then any further illegal inputs won't trigger event any more.
    setDiscount({
      state: MODIFIED,
      value: handleDiscountValue(e.target.value),
    })
  }

  useEffect(() => {
    console.log('effect - products')
    let filteredVariants = []
    const filterVariants = getAllFilters(filters, false)

    for (let index = 0; index < filteredProducts.length; index++) {
      filteredVariants = [
        ...filteredVariants,
        ...filterVariants(filteredProducts[index].variants),
      ]
    }

    setVariantsCounts(filteredVariants.length)

    setSelectedOnly({
      max: filteredProducts.length,
      checked: true,
      selected: filteredProducts.length,
    })
  }, [filteredProducts, filters])

  return (
    <div style={{ background: background }} className="products-wrapper">
      <div>
        <TitleCheckbox
          selected={selected}
          length={variantsCounts}
          checked={checked}
          setChecked={setChecked}
          inputId={`${idGroups.filteredProducts}--${idRoles.section}-${collectionId}`}
          inputTitle={inputTitle}
          headerSize="h2"
        />

        <TitleCheckbox
          selected={selectedChildren}
          length={filteredProducts.length}
          checked={showVariants}
          setChecked={setShowVariants}
          inputId={`${idGroups.showVariants}--${idRoles.section}-${collectionId}`}
          inputTitle="Show variants"
        />

        <TitleCheckbox
          selected={onlySelectedChildren}
          length={filteredProducts.length}
          checked={onlySelected}
          setChecked={setOnlySelected}
          inputId={`${idGroups.setPrice}--${idRoles.section}-${collectionId}`}
          inputTitle="Only selected"
        />

        <ParentCheckbox
          parentCheckbox={selectedOnly}
          setParentCheckbox={setSelectedOnly}
          inputId={`${idGroups.setPrice}--test-${collectionId}`}
          inputTitle="Selected Only "
        />
      </div>

      <div>
        <label
          style={{ marginLeft: '4px' }}
          htmlFor={`${idGroups.setPrice}--${idRoles.section}`}
        >
          <strong>Discount: </strong>
        </label>
        <input
          id={`${idGroups.setPrice}--${idRoles.section}`}
          style={{ width: '40px' }}
          type="number"
          value={discount.value}
          onChange={handleSetDiscount}
          min="0"
          max="100"
        />
        <span>%</span>

        <button onClick={resetPriceSetting}>RESET PRICE SETTING</button>
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
              checked={checked}
              setSelected={setSelected}
              showVariants={showVariants}
              setSelectedChildren={setSelectedChildren}
              onlySelected={onlySelected}
              setOnlySelectedChildren={setOnlySelectedChildren}
              discountFromSection={discount}
              resetFromSection={reset}
              variantsCounts={variantsCounts}
              filteredProductsLength={filteredProducts.length}
              selectedOnlyTest={selectedOnly}
              setSelectedOnlyTest={setSelectedOnly}
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

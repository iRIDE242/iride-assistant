import { useEffect, useState } from 'react'
import { add, map, pipe, reduce } from 'ramda'
import FilteredProduct from './FilteredProduct'
import { removeSelectedHiddenStatus, updateSelectedVariants } from '../../actions/products'
import { getHiddens } from '../../actions/product'
import {
  createTwoDigitString,
  getLength,
  handleDiscountValue,
  MODIFIED,
  NOT_MODIFIED,
} from '../../utils/helper'
import TitleCheckbox from '../TitleCheckbox'
import { updateProducts, useProducts } from '../../context/products'
import { collections, idGroups, idRoles } from '../../utils/config'
import { getAllFilters } from '../../utils/filters'
import { useDiscount, useReset } from '../../utils/customHooks'

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

          // variantData.push(id)

          const cap = e.target.querySelector(
            `#${idGroups.variant}--${idRoles.cap}-${id}`
          ).value
          const price = e.target.querySelector(
            `#${idGroups.variant}--${idRoles.price}-${id}`
          ).value

          console.log(cap)
          console.log(price)

          const data = {
            id,
            compare_at_price: cap,
            price
          }
          variantData.push(data)

        } else if (productInputRegex.test(e.target[index].id)) {
          productIds.push(
            e.target[index].id.replace(productInputRegex, replacer)
          )
        }
      }
    }

    console.log(variantData)
    console.log(productIds)

    try {
      const result = await updateSelectedVariants(
        variantData,
        productIds
      )
      console.log(result)
      // updateProducts(dispatch, updatedProducts)
    } catch (error) {
      // bulkyVisuallyToggleVariants(variantIds, 'resume')
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

  // const resetPriceSetting = e => {
  //   e.preventDefault()
  //   setReset(prev => prev + 1)
  // }

  useEffect(() => {
    let filteredVariants = []
    const filterVariants = getAllFilters(filters, false)

    for (let index = 0; index < filteredProducts.length; index++) {
      filteredVariants = [
        ...filteredVariants,
        ...filterVariants(filteredProducts[index].variants),
      ]
    }

    setVariantsCounts(filteredVariants.length)
  }, [filteredProducts, filters])

  return (
    <div style={{ background: background }}>
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

      <div style={{ color: mainColor }}>
        <form onSubmit={handleTestSubmit}>
          {filteredProducts.map(product => (
            <FilteredProduct
              key={product.id}
              product={product}
              checked={checked}
              setSelected={setSelected}
              showVariants={showVariants}
              setSelectedChildren={setSelectedChildren}
              discountFromSection={discount}
              resetFromSection={reset}
            />
          ))}
          {filters.hiddenVariants.status && (
            <button type="submit">
              REMOVE HIDDEN STATUS FROM ALL SELECTED
            </button>
          )}

          <button type="submit">TEST SUBMIT</button>
        </form>
      </div>
    </div>
  )
}

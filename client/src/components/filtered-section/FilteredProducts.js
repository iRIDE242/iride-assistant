import { useEffect, useState } from 'react'
import { add, map, pipe, reduce } from 'ramda'
import FilteredProduct from './FilteredProduct'
import { removeSelectedHiddenStatus } from '../../actions/products'
import { getHiddens } from '../../actions/product'
import { getLength } from '../../utils/helper'
import TitleCheckbox from '../TitleCheckbox'
import { updateProducts, useProducts } from '../../context/products'
import { collections } from '../../utils/config'

const variantInputRegex = /^\d/ // Digid leading the string
const productInputRegex = /hidden-product-(\d+)/
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

  const [
    {
      filters: { hiddenVariants },
    },
    dispatch,
  ] = useProducts()

  const inputTitle = `${collections[collectionId].name.toUpperCase()} [Counts: 
  ${filteredProducts.length}]`

  const handleSubmit = async e => {
    e.preventDefault()

    const variantIds = []
    const productIds = []

    for (let index = 0; index < e.target.length; index++) {
      if (e.target[index].nodeName === 'INPUT' && e.target[index].checked) {
        if (variantInputRegex.test(e.target[index].id)) {
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

  const handleTestSubmit = e => {
    e.preventDefault()

    const variantIds = []
    const productIds = []

    for (let index = 0; index < e.target.length; index++) {
      if (e.target[index].nodeName === 'INPUT' && e.target[index].checked) {
        if (variantInputRegex.test(e.target[index].id)) {
          variantIds.push(e.target[index].id)
        } else if (productInputRegex.test(e.target[index].id)) {
          productIds.push(
            e.target[index].id.replace(productInputRegex, replacer)
          )
        }
      }
    }

    console.log(variantIds)
    console.log(productIds)
  }

  useEffect(() => {
    const getHiddenVariantsLengthsFromProducts = pipe(
      map(getHiddens),
      map(getLength)
    )
    const hiddenVariantsLengthsFromProducts =
      getHiddenVariantsLengthsFromProducts(filteredProducts)

    const getVariantCounts = reduce(add, 0)

    setVariantsCounts(getVariantCounts(hiddenVariantsLengthsFromProducts))
  }, [filteredProducts])

  return (
    <div style={{ background: background }}>
      <TitleCheckbox
        selected={selected}
        length={variantsCounts}
        checked={checked}
        setChecked={setChecked}
        inputId="hidden-product-info"
        inputTitle={inputTitle}
        headerSize="h2"
      />

      <TitleCheckbox
        selected={selectedChildren}
        length={filteredProducts.length}
        checked={showVariants}
        setChecked={setShowVariants}
        inputId={`show-variants--section-${collectionId}`}
        inputTitle="Show variants"
      />

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
            />
          ))}
          {hiddenVariants.status && (
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

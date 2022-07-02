import { useEffect, useState } from 'react'
import FilteredProduct from './FilteredProduct'
import { removeSelectedHiddenStatus } from '../actions/products'
import { getHiddens } from '../actions/product'
import { add, map, pipe, reduce } from 'ramda'
import { getLength } from '../utils/helper'
import TitleCheckbox from './TitleCheckbox'
import { updateProducts, useProducts } from '../context/products'

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

export default function HiddenDetail({
  filteredProducts,
  settings: { background, mainColor },
}) {
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState(0)
  const [variantsCounts, setVariantsCounts] = useState(0)

  const [
    {
      filters: { hiddenVariants },
    },
    dispatch,
  ] = useProducts()

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
        inputTitle="PRODUCTS WITH HIDDEN VARIANTS"
        headerSize="h2"
      />

      <div style={{ color: mainColor }}>
        <form onSubmit={handleSubmit}>
          {filteredProducts.map(product => (
            <FilteredProduct
              key={product.id}
              product={product}
              checked={checked}
              setSelected={setSelected}
            />
          ))}
          {hiddenVariants.status && (
            <button type="submit">
              REMOVE HIDDEN STATUS FROM ALL SELECTED
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

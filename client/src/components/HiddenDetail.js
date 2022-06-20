import { useEffect, useState } from 'react'
import ProductWithHidden from './ProductWithHidden'
import { getHiddens } from '../actions/productAPIs'
import { add, map, pipe, reduce } from 'ramda'
import { getLength } from '../utils/helper'
import TitleCheckbox from './TitleCheckbox'

const regex = /^\d/

export default function HiddenDetail({
  filteredProducts,
  settings: { background, mainColor },
}) {
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState(0)
  const [variantsCounts, setVariantsCounts] = useState(0)

  const handleSubmit = e => {
    e.preventDefault()

    const variantIds = []

    for (let index = 0; index < e.target.length; index++) {
      if (
        e.target[index].nodeName === 'INPUT' &&
        e.target[index].checked &&
        regex.test(e.target[index].id)
      )
        variantIds.push(e.target[index].id)
    }

    console.log(variantIds)
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
            <ProductWithHidden
              key={product.id}
              product={product}
              checked={checked}
              setSelected={setSelected}
            />
          ))}
          <button type="submit">SHOW SELECTED VARIANTS</button>
        </form>
      </div>
    </div>
  )
}

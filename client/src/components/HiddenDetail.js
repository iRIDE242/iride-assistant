import { useState } from 'react'
import ProductWithHidden from './ProductWithHidden'

const regex = /^\d/

export default function HiddenDetail({
  productsWithHidden,
  setProductsWithHidden,
  settings: {
    localStorageKey,
    background,
    mainColor,
    ignoredColor,
    detailTitle,
    mainTitle,
  },
}) {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

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

  return (
    <div style={{ background: background }}>
      <input
        type="checkbox"
        id="hidden-product-info"
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor="hidden-product-info">
        <h2 style={{ display: 'inline-block' }}>
          PRODUCTS WITH HIDDEN VARIANTS
        </h2>
      </label>

      <div style={{ color: mainColor }}>
        <form onSubmit={handleSubmit}>
          {productsWithHidden.map(product => (
            <ProductWithHidden
              key={product.id}
              product={product}
              checked={checked}
            />
          ))}
          <button type="submit">SHOW SELECTED VARIANTS</button>
        </form>
      </div>
    </div>
  )
}

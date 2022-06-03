import { useRef, useState } from 'react'
import useLocalStorageState from '../utils/useLocalStorageState'
import Product from './Product'

export default function HiddenDetail({
  productsWithHidden,
  settings: {
    localStorageKey,
    background,
    mainColor,
    ignoredColor,
    detailTitle,
    mainTitle,
  },
}) {
  return (
    <div style={{ background: background }}>
      <h2>PRODUCTS WITH HIDDEN VARIANTS</h2>

      <div style={{ color: mainColor }}>
        {productsWithHidden.map(product => (
          <div key={product.id}>
            <h3>{product.title}</h3>
            <ul>
              {product.variants.map(
                variant =>
                  variant.weight === 9999 && (
                    <li
                      key={variant.id}
                    >{`${product.title} - ${variant.title}`}</li>
                  )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

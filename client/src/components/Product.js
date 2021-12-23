import React from 'react'
import { getProductTitle } from '../actions/productAPIs'

function Product(props) {
  const { product } = props
  const title = getProductTitle(product)

  return (
    <div>
      <p>{title}</p>
    </div>
  )
}

export default Product

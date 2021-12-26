import React from 'react'
import { getTitle } from '../actions/shared'

function Product(props) {
  const { product } = props
  const title = getTitle(product)

  return (
    <div>
      <p>{title}</p>
    </div>
  )
}

export default Product

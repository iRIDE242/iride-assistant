import React from 'react'
import { getTitle } from '../actions/shared'

function Product(props) {
  const { product } = props
  const title = getTitle(product)

  return (
    <p>{title}</p>
  )
}

export default Product

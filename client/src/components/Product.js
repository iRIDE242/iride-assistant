import React, { useState } from 'react'
import { getTitle } from '../actions/shared'

function Product(props) {
  const [isClicked, setIsClicked] = useState(false)
  const { product, fromInventory, isPartial } = props
  const title = getTitle(product)

  const handleClick = e => {
    e.preventDefault()
    setIsClicked(true)
    navigator.clipboard.writeText(title)
  }

  const saveIgnore = e => {
    e.preventDefault()
    console.log(product)
    console.log(typeof product.id) // number

    const ignored = window.localStorage.getItem('ignored') ? JSON.parse(window.localStorage.getItem('ignored')) : []
    ignored.push(product.id)
    window.localStorage.setItem('ignored', JSON.stringify(ignored))
  }

  return (
    <>
      <div 
        style={{ 
          display: 'flex', 
          margin: 'unset',
          alignItems: 'center'
        }}>
        <p>{title}</p>
        {fromInventory && <button onClick={handleClick}>COPY</button>}
        {isPartial && <button onClick={saveIgnore}>SET TO IGNORE</button>}
        {isClicked && <p style={{ color: 'green' }}>Title has been copied</p>}
      </div>
      {fromInventory && <hr />}
    </>
  )
}

export default Product

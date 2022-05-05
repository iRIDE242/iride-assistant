import React, { useState } from 'react'
import { getTitle } from '../actions/shared'

function Product(props) {
  const [isClicked, setIsClicked] = useState(false)
  const { product, fromInventory } = props
  const title = getTitle(product)

  const handleClick = e => {
    e.preventDefault()
    setIsClicked(true)
    navigator.clipboard.writeText(title)
  }

  return (
    <>
      <div 
        style={{ 
          display: 'flex', 
          margin: 'unset',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <p>{title}</p>
        {fromInventory && <button onClick={handleClick}>Copy</button>}
        {isClicked && <p style={{ color: 'green' }}>Title has been copied</p>}
      </div>
      {fromInventory && <hr />}
    </>
  )
}

export default Product

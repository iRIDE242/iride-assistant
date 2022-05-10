import React, { useState } from 'react'
import { getTitle } from '../actions/shared'

function Product(props) {
  const [isClicked, setIsClicked] = useState(false)
  const { product, fromInventory, isIgnored, notIgnored, handleAddToIgnored, handleRemoveFromIgnored } = props
  const title = getTitle(product)

  const handleClick = e => {
    e.preventDefault()
    setIsClicked(true)
    navigator.clipboard.writeText(title)
  }

  const addToIgnored = () => {
    handleAddToIgnored(product.id)
  }

  const removeFromIgnored = () => {
    handleRemoveFromIgnored(product.id)
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
        {notIgnored && <button onClick={addToIgnored}>ADD TO IGNORED</button>}
        {isIgnored && <button onClick={removeFromIgnored}>REMOVE FROM IGNORED</button>}
        {isClicked && <p style={{ color: 'green' }}>Title has been copied</p>}
      </div>
      {fromInventory && <hr />}
    </>
  )
}

export default Product

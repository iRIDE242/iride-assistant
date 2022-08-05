import React, { useState } from 'react'
import { getTitle } from 'utils/helper'
import CopyButton from 'components/CopyButton'
import CopyHint from 'components/CopyHint'
import { ProductProps } from './types'

function Product(props: ProductProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const {
    product,
    fromInventory,
    isIgnored,
    notIgnored,
    handleAddToIgnored,
    handleRemoveFromIgnored,
    from,
  } = props
  const title = getTitle(product)

  const addToIgnored = () => {
    handleAddToIgnored?.(product.id)
  }

  const removeFromIgnored = () => {
    handleRemoveFromIgnored?.(product.id)
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          margin: 'unset',
          alignItems: 'center',
        }}
      >
        <p>{title}</p>
        <CopyButton
          title={title}
          showCopy={fromInventory}
          setIsCopied={setIsCopied}
        />
        {notIgnored && <button onClick={addToIgnored}>ADD TO IGNORED</button>}
        {isIgnored && from === 'item' && (
          <button onClick={removeFromIgnored}>REMOVE FROM IGNORED</button>
        )}
        <CopyHint isCopied={isCopied} />
        {isIgnored && from === 'vendor' && <p>From vendor</p>}
      </div>
      {fromInventory && <hr />}
    </>
  )
}

export default Product

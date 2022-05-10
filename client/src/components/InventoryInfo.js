import { useState } from 'react'
import useLocalStorageState from '../utils/useLocalStorageState'
import Product from './Product'

export default function InventoryInfo({ localsOutOfStock }) {
  const [ignoredProductIds, setIgnoredProductIds] = useLocalStorageState(
    'ignoredProductIds',
    []
  )

  const [isHidden, setIsHidden] = useState(true)

  const {
    activeLocallyOutOfStockProducts: gone,
    activeLocallyHavingOutOfStockProducts: partially,
  } = localsOutOfStock

  if (!gone.length && !partially.length) {
    return <p>No products are out of stock locally.</p>
  }

  let notIgnored = []
  let ignored = []

  if (partially.length) {
    partially.forEach(part => {
      ignoredProductIds.indexOf(part.id) === -1
        ? notIgnored.push(part)
        : ignored.push(part)
    })
  }

  const handleAddToIgnored = ignoredProductId => {
    setIgnoredProductIds(prevIds => [...prevIds, ignoredProductId])
  }

  const handleRemoveFromIgnored = notIgnoredProductId => {
    setIgnoredProductIds(prevIds =>
      prevIds.filter(id => id !== notIgnoredProductId)
    )
  }

  const toggleIgnored = () => {
    setIsHidden(prev => !prev)
  }

  return (
    <>
      {gone.length > 0 && (
        <div style={{ color: 'red' }}>
          <h3>Products out of stock [Counts: {gone.length}]</h3>
          {gone.map(p => (
            <Product key={p.id} product={p} fromInventory={true} />
          ))}
        </div>
      )}
      {partially.length > 0 && (
        <>
          <div style={{ color: 'orange' }}>
            <h3>
              Products having out of stock variants [Counts: {notIgnored.length}
              ]
            </h3>
            {notIgnored.map(p => (
              <Product
                key={p.id}
                product={p}
                fromInventory={true}
                notIgnored={true}
                handleAddToIgnored={handleAddToIgnored}
              />
            ))}
          </div>
          {ignored.length > 0 && (
            <>
              <button onClick={toggleIgnored}>
                {isHidden ? 'SHOW IGNORED' : 'HIDE IGNORED'}
              </button>
              <div
                style={{ color: 'purple', display: isHidden ? 'none' : 'block' }}
              >
                <h3>
                  Ignored partially out of stock products [Counts: {ignored.length}]
                </h3>
                {ignored.map(p => (
                  <Product
                    key={p.id}
                    product={p}
                    fromInventory={true}
                    isIgnored={true}
                    handleRemoveFromIgnored={handleRemoveFromIgnored}
                  />
                ))}
              </div>
            </>
          )}
          
        </>
      )}
    </>
  )
}

import { useRef, useState } from 'react'
import useLocalStorageState from '../utils/useLocalStorageState'
import Product from './Product'

export default function InventoryInfo({ localsOutOfStock }) {
  const [ignoredOutOfStockIds, setIgnoredOutOfStockIds] = useLocalStorageState(
    'ignoredOutOfStockIds',
    []
  )
  const [ignoredProductIds, setIgnoredProductIds] = useLocalStorageState(
    'ignoredProductIds',
    []
  )
  const [ignoredVendors, setIgnoredVendors] = useLocalStorageState(
    'ignoredVendors',
    []
  )

  const [isHidden, setIsHidden] = useState(true)
  const [isHiddenOutOfStock, setIsHiddenOutOfStock] = useState(true)
  const [isModified, setIsModified] = useState(false)
  const [vendorString, setVendorString] = useState(() => ignoredVendors.join())

  // Original vendor string
  const vendorStringRef = useRef(vendorString)

  const {
    activeLocallyOutOfStockProducts: gone,
    activeLocallyHavingOutOfStockProducts: partially,
  } = localsOutOfStock

  if (!gone.length && !partially.length) {
    return <p>No products are out of stock locally.</p>
  }

  let notIgnoredOutOfStock = []
  let ignoredOutOfStock = []

  if (gone.length) {
    gone.forEach(product => {
      ignoredOutOfStockIds.indexOf(product.id) === -1
        ? notIgnoredOutOfStock.push(product)
        : ignoredOutOfStock.push({ product, from: 'item' })
    })
  }

  let notIgnored = []
  let ignored = []

  if (partially.length) {
    partially.forEach(product => {
      ignoredProductIds.indexOf(product.id) === -1
        ? ignoredVendors.indexOf(product.vendor) === -1
          ? notIgnored.push(product)
          : ignored.push({ product, from: 'vendor' })
        : ignored.push({ product, from: 'item' })
    })
  }

  const handleAddToIgnored = setIgnored => ignoredProductId => {
    setIgnored(prevIds => [...prevIds, ignoredProductId])
  }

  const handleRemoveFromIgnored = setIgnored => notIgnoredProductId => {
    setIgnored(prevIds => prevIds.filter(id => id !== notIgnoredProductId))
  }

  const toggleIgnored = setToggle => () => {
    setToggle(prev => !prev)
  }

  const handleVendorSubmit = e => {
    e.preventDefault()
    vendorStringRef.current = vendorString

    setIgnoredVendors(vendorString.split(',').map(str => str.trim()))
    setIsModified(false)
  }

  const handleVendorChange = e => {
    console.log(`event: ${e.target.value}`)
    console.log(`ref: ${vendorStringRef.current}`)
    e.target.value !== vendorStringRef.current
      ? setIsModified(true)
      : setIsModified(false)
    setVendorString(e.target.value)
  }

  const handleClearIgnored = setIgnored => () => {
    setIgnored([])
  }

  return (
    <>
      {gone.length > 0 && (
        <div style={{ background: 'MistyRose' }}>
          <h2>COMPLETELY OUT OF STOCK</h2>
          <div style={{ color: 'red' }}>
            <h3>Out of stock products [Counts: {notIgnoredOutOfStock.length}]</h3>
            {notIgnoredOutOfStock.map(p => (
              <Product
                key={p.id}
                product={p}
                fromInventory={true}
                notIgnored={true}
                handleAddToIgnored={handleAddToIgnored(setIgnoredOutOfStockIds)}
              />
            ))}
          </div>
          {ignoredOutOfStock.length > 0 && (
            <>
              <button onClick={toggleIgnored(setIsHiddenOutOfStock)}>
                {isHiddenOutOfStock ? 'SHOW IGNORED' : 'HIDE IGNORED'}
              </button>
              <div
                style={{
                  color: 'navy',
                  display: isHiddenOutOfStock ? 'none' : 'block',
                }}
              >
                <h3>Ignored [Counts: {ignoredOutOfStock.length}]</h3>
                {ignoredOutOfStock.map(({ product, from }) => (
                  <Product
                    key={product.id}
                    product={product}
                    fromInventory={true}
                    isIgnored={true}
                    handleRemoveFromIgnored={handleRemoveFromIgnored(
                      setIgnoredOutOfStockIds
                    )}
                    from={from}
                  />
                ))}
                <div>
                  <button onClick={handleClearIgnored(setIgnoredOutOfStockIds)}>
                    CLEAR ALL ITEMS IN THE IGNORED LIST [COUNTS:{' '}
                    {ignoredOutOfStock.length}]
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {partially.length > 0 && (
        <div style={{ background: 'beige' }}>
          <h2>PARTIALLY OUT OF STOCK</h2>
          <div>
            <form onSubmit={handleVendorSubmit}>
              <label htmlFor="ignored-vendors">
                Ignored vendors (case sensitive)
              </label>{' '}
              <input
                type="text"
                id="ignored-vendors"
                onChange={handleVendorChange}
                value={vendorString}
              />
              <button type="submit" disabled={!isModified}>
                SUBMIT
              </button>
            </form>
          </div>

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
                handleAddToIgnored={handleAddToIgnored(setIgnoredProductIds)}
              />
            ))}
          </div>
          {ignored.length > 0 && (
            <>
              <button onClick={toggleIgnored(setIsHidden)}>
                {isHidden ? 'SHOW IGNORED' : 'HIDE IGNORED'}
              </button>
              <div
                style={{
                  color: 'purple',
                  display: isHidden ? 'none' : 'block',
                }}
              >
                <h3>Ignored [Counts: {ignored.length}]</h3>
                {ignored.map(({ product, from }) => (
                  <Product
                    key={product.id}
                    product={product}
                    fromInventory={true}
                    isIgnored={true}
                    handleRemoveFromIgnored={handleRemoveFromIgnored(
                      setIgnoredProductIds
                    )}
                    from={from}
                  />
                ))}
                <div>
                  <button onClick={handleClearIgnored(setIgnoredProductIds)}>
                    CLEAR ALL ITEMS IN THE IGNORED LIST [COUNTS:{' '}
                    {ignoredProductIds.length}]
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

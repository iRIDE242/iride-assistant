import { useRef, useState } from 'react'
import useLocalStorageState from '../utils/useLocalStorageState'
import Product from './Product'

export default function InventoryInfo({ localsOutOfStock }) {
  const [ignoredProductIds, setIgnoredProductIds] = useLocalStorageState(
    'ignoredProductIds',
    []
  )
  const [ignoredVendors, setIgnoredVendors] = useLocalStorageState(
    'ignoredVendors',
    []
  )

  const [isHidden, setIsHidden] = useState(true)
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

  const handleClearIgnored = () => {
    setIgnoredProductIds([])
  }

  return (
    <>
      {gone.length > 0 && (
        <>
          <h2>COMPLETELY OUT OF STOCK</h2>
          <div style={{ color: 'red' }}>
            <h3>Out of stock products [Counts: {gone.length}]</h3>
            {gone.map(p => (
              <Product key={p.id} product={p} fromInventory={true} />
            ))}
          </div>
        </>
      )}
      {partially.length > 0 && (
        <>
          <h2>PARTIALLY OUT OF STOCK</h2>
          <div>
            <form onSubmit={handleVendorSubmit}>
              <label htmlFor="ignored-vendors">Ignored vendors (case sensitive)</label>{' '}
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
                style={{
                  color: 'purple',
                  display: isHidden ? 'none' : 'block',
                }}
              >
                <h3>Ignored list [Counts: {ignored.length}]</h3>
                {ignored.map(({ product, from }) => (
                  <Product
                    key={product.id}
                    product={product}
                    fromInventory={true}
                    isIgnored={true}
                    handleRemoveFromIgnored={handleRemoveFromIgnored}
                    from={from}
                  />
                ))}
                <div>
                  <button onClick={handleClearIgnored}>
                    CLEAR IGNORED LIST FOR PARTIALLY OUT OF STOCK
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

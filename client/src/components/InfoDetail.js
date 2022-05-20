import { useRef, useState } from 'react'
import useLocalStorageState from '../utils/useLocalStorageState'
import Product from './Product'

export default function InfoDetail({
  outOfStockProducts,
  settings: {
    localStorageKey,
    background,
    mainColor,
    ignoredColor,
    detailTitle,
    mainTitle,
  },
}) {
  const [ignoredOutOfStockIds, setIgnoredOutOfStockIds] = useLocalStorageState(
    localStorageKey,
    []
  )
  const [ignoredVendors, setIgnoredVendors] = useLocalStorageState(
    'ignoredVendors',
    []
  )
  const [isHiddenOutOfStock, setIsHiddenOutOfStock] = useState(true)
  const [isModified, setIsModified] = useState(false)
  const [vendorString, setVendorString] = useState(() => ignoredVendors.join())

  // Original vendor string
  const vendorStringRef = useRef(vendorString)

  let notIgnoredOutOfStock = []
  let ignoredOutOfStock = []

  if (outOfStockProducts.length) {
    outOfStockProducts.forEach(product => {
      ignoredOutOfStockIds.indexOf(product.id) === -1
        ? localStorageKey === 'ignoredProductIds'
          ? ignoredOutOfStockIds.indexOf(product.vendor) === -1
            ? notIgnoredOutOfStock.push(product)
            : ignoredOutOfStock.push({ product, from: 'vendor' })
          : notIgnoredOutOfStock.push(product)
        : ignoredOutOfStock.push({ product, from: 'item' })
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

  const handleClearIgnored = setIgnored => () => {
    setIgnored([])
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

  return (
    <div style={{ background: background }}>
      <h2>{detailTitle}</h2>

      {localStorageKey === 'ignoredProductIds' && (
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
      )}

      <div style={{ color: mainColor }}>
        <h3>
          {mainTitle} [Counts: {notIgnoredOutOfStock.length}]
        </h3>
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
              color: ignoredColor,
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
  )
}
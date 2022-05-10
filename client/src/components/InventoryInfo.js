import Product from './Product'

export default function InventoryInfo({ localsOutOfStock }) {
  const { 
    activeLocallyOutOfStockProducts: gone, 
    activeLocallyHavingOutOfStockProducts: partially 
  } = localsOutOfStock

  if (!gone.length && !partially.length) {
    return <p>No products are out of stock locally.</p>
  }

  return (
    <>
      {gone.length > 0 && (
        <div style={{color: 'red'}}>
          <h3>Products out of stock [Counts: {gone.length}]</h3>
          {gone.map((p) => (
            <Product key={p.id} product={p} fromInventory={true} />
          ))}
        </div>
      )}
      {partially.length > 0 && (
        <div style={{color: 'orange'}}>
          <h3>Products having out of stock variants [Counts: {partially.length}]</h3>
          {partially.map((p) => (
            <Product key={p.id} product={p} fromInventory={true} isPartial={true} />
          ))}
        </div>
      )}
    </>
  )
}
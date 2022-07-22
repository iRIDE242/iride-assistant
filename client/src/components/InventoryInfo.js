import InfoDetail from './InfoDetail'

const settingsForGone = {
  localStorageKey: 'ignoredOutOfStockIds',
  background: 'MistyRose',
  mainColor: 'red',
  ignoredColor: 'navy',
  detailTitle: 'COMPLETELY OUT OF STOCK',
  mainTitle: 'Out of stock products ',
}

const settingsForPartially = {
  localStorageKey: 'ignoredProductIds',
  background: 'beige',
  mainColor: 'orange',
  ignoredColor: 'purple',
  detailTitle: 'PARTIALLY OUT OF STOCK',
  mainTitle: 'Products having out of stock variants ',
}

export default function InventoryInfo({ localsOutOfStock }) {
  const {
    activeLocallyOutOfStockProducts: gone,
    activeLocallyHavingOutOfStockProducts: partially,
  } = localsOutOfStock

  if (!gone.length && !partially.length) {
    return <p>No products are out of stock locally.</p>
  }

  return (
    <>
      {gone.length > 0 && (
        <InfoDetail outOfStockProducts={gone} settings={settingsForGone} />
      )}

      {partially.length > 0 && (
        <InfoDetail
          outOfStockProducts={partially}
          settings={settingsForPartially}
        />
      )}
    </>
  )
}

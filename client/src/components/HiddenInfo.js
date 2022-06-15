import HiddenDetail from './HiddenDetail'

const settingsForGone = {
  localStorageKey: 'ignoredOutOfStockIds',
  background: 'MistyRose',
  mainColor: 'red',
  ignoredColor: 'navy',
  detailTitle: 'COMPLETELY OUT OF STOCK',
  mainTitle: 'Out of stock products ',
}

export default function HiddenInfo({ filteredProducts }) {

  if (!filteredProducts.length) {
    return <p>No products have hidden variants.</p>
  }

  return (
    <>
      {filteredProducts.length > 0 && (
        <HiddenDetail filteredProducts={filteredProducts} settings={settingsForGone} />
      )}
    </>
  )
}

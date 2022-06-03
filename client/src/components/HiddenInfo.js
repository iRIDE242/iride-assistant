import HiddenDetail from './HiddenDetail'

const settingsForGone = {
  localStorageKey: 'ignoredOutOfStockIds',
  background: 'MistyRose',
  mainColor: 'red',
  ignoredColor: 'navy',
  detailTitle: 'COMPLETELY OUT OF STOCK',
  mainTitle: 'Out of stock products ',
}

export default function HiddenInfo({ productsWithHidden }) {
  if (!productsWithHidden.length) {
    return <p>No products have hidden variants.</p>
  }

  return (
    <>
      {productsWithHidden.length > 0 && (
        <HiddenDetail productsWithHidden={productsWithHidden} settings={settingsForGone} />
      )}
    </>
  )
}

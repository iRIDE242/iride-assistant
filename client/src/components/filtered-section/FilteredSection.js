import FilteredProducts from './FilteredProducts'

const settingsForGone = {
  localStorageKey: 'ignoredOutOfStockIds',
  background: 'lightgreen',
  mainColor: 'darkgreen',
  ignoredColor: 'navy',
  detailTitle: 'COMPLETELY OUT OF STOCK',
  mainTitle: 'Out of stock products ',
}

export default function FilteredSection({ collectionId, filteredProducts }) {
  if (!filteredProducts.length) {
    return (
      <div style={{ background: settingsForGone.background }}>
        <p>No products have hidden variants.</p>
      </div>
    )
  }

  return (
    <>
      {filteredProducts.length > 0 && (
        <FilteredProducts
          filteredProducts={filteredProducts}
          settings={settingsForGone}
          collectionId={collectionId}
        />
      )}
    </>
  )
}

import { useProducts } from '../../context/products'
import { getAllFilters } from '../../utils/filters'
import { mapValueToArray } from '../../utils/helper'
import FilteredProducts from './FilteredProducts'

const settingsForGone = {
  localStorageKey: 'ignoredOutOfStockIds',
  background: 'lightgreen',
  mainColor: 'darkgreen',
  ignoredColor: 'navy',
  detailTitle: 'COMPLETELY OUT OF STOCK',
  mainTitle: 'Out of stock products ',
}

export default function FilteredSection({ collectionId }) {
  const [{ products: productsMap, filters }] = useProducts()

  const products = mapValueToArray(productsMap)
  const filteredProducts = getAllFilters(filters)(products)

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

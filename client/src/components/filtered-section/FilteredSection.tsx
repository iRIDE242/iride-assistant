import FilteredProducts from './FilteredProducts'
import { FilteredSectionProps, SettingsForGone } from './types'

const settingsForGone: SettingsForGone = {
  localStorageKey: 'ignoredOutOfStockIds',
  background: 'aliceblue',
  mainColor: 'darkgreen',
  ignoredColor: 'navy',
  detailTitle: 'COMPLETELY OUT OF STOCK',
  mainTitle: 'Out of stock products ',
}

export default function FilteredSection({ collectionId, filteredProducts }: FilteredSectionProps) {
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

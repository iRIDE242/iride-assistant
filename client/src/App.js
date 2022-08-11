import React, { useEffect, useState } from 'react'
import { createPrevAndNextFromHeader } from './actions/header.action'
import './App.css'
import InventoryInfo from './components/inventory/InventoryInfo'
import FilteredSection from './components/filtered-section/FilteredSection'
import { getProductsByCollectionId, getProductsByPageInfo } from './utils/api'
import { collections } from './utils/config'
import {
  getProducts,
  toggleHiddens,
  useProducts,
} from './context/products.context'
import { arrayToMapWithIdAsKey } from './utils/helper'
import { useFilteredProducts } from './utils/customHooks'
import { getLocallyOutOfStockProducts } from 'actions/inventory.action'

const emptyLink = {
  limit: '',
  pageInfo: '',
}

const initialPrevAndNext = {
  direction: null,
  prev: emptyLink,
  next: emptyLink,
  lastPrev: emptyLink,
  lastNext: emptyLink,
}

function App() {
  const [{ products: productsMap, filters }, dispatch] = useProducts()

  const [localsOutOfStock, setLocalsOutOfStock] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [collectionId, setCollectionId] = useState('210639487136')
  const [prevAndNext, setPrevAndNext] = useState(initialPrevAndNext)

  // This state is essential to reset each filtered product to its original state when toggling filter.
  // Each filtered product consists of many states from different custom hooks.
  // It's quite complex to partially modify certain hook but not affect others.
  // Additional, React will partially update array structure elements for optimization reason.
  // This feature will make the state much messier and harder to manage.
  // So the most efficient and simple way is to reset the state to a blank array then update it later from useEffect.
  const [filteredProducts, setFilteredProducts] = useFilteredProducts(
    productsMap,
    filters
  )

  useEffect(() => {
    setIsLoading(true)
    getProductsByCollectionId(collectionId)
      .then(({ products, headerObj }) => {
        // Convert products array to map preparing for products state
        const productsMap = arrayToMapWithIdAsKey(products)
        getProducts(dispatch, productsMap)
        console.log(headerObj.link)

        setPrevAndNext(prevState => ({
          ...prevState,
          ...createPrevAndNextFromHeader(headerObj),
        }))
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      })
  }, [collectionId, dispatch])

  const handlePrevOrNextClick = direction => async e => {
    setIsLoading(true)
    setLocalsOutOfStock(null)

    try {
      const { prev, next } = prevAndNext
      const link = direction === 'prev' ? prev : next
      const { products, headerObj } = await getProductsByPageInfo(link)

      const productsMap = arrayToMapWithIdAsKey(products)
      getProducts(dispatch, productsMap)

      if (direction === 'prev')
        setPrevAndNext(prevState => ({
          ...prevState,
          ...createPrevAndNextFromHeader(headerObj),
          direction: 'prev',
          lastPrev: { ...prevState.prev },
        }))

      if (direction === 'next')
        setPrevAndNext(prevState => ({
          ...prevState,
          ...createPrevAndNextFromHeader(headerObj),
          direction: 'next',
          lastNext: { ...prevState.next },
        }))

      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const handleSelectChange = e => {
    setCollectionId(e.target.value)
    setLocalsOutOfStock(null)

    // Reset prevAndNext to make sure no stale data from last collection
    setPrevAndNext(initialPrevAndNext)
  }

  const handleQuery = async () => {
    setIsLoading(true)
    setLocalsOutOfStock(null)

    try {
      let result
      const { direction, lastPrev, lastNext } = prevAndNext

      if (!direction) {
        result = await getProductsByCollectionId(collectionId)
      } else {
        if (direction === 'prev') result = await getProductsByPageInfo(lastPrev)
        if (direction === 'next') result = await getProductsByPageInfo(lastNext)
      }

      const products = arrayToMapWithIdAsKey(result.products)
      getProducts(dispatch, products)

      const locallyOutOfStockProducts = await getLocallyOutOfStockProducts(
        result.products
      )
      setLocalsOutOfStock(locallyOutOfStockProducts)

      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  // Note, any filter change will cause product list reset
  // This filter is based on the result of current products
  const handleHiddenVariants = () => {
    toggleHiddens(dispatch)
    setFilteredProducts([])
  }

  if (!productsMap.size) return <p>Loading...</p>

  return (
    <div className="App">
      <div>
        <label htmlFor="collections">Choose a collection: </label>
        <select
          name="collections"
          id="collections"
          disabled={isLoading}
          value={collectionId}
          onChange={handleSelectChange}
        >
          {Object.values(collections).map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          disabled={isLoading || !prevAndNext.prev.pageInfo}
          onClick={handlePrevOrNextClick('prev')}
        >
          PREVIOUS
        </button>

        <button
          disabled={isLoading || !prevAndNext.next.pageInfo}
          onClick={handlePrevOrNextClick('next')}
        >
          NEXT
        </button>
      </div>

      <div>
        <button onClick={handleQuery} disabled={isLoading}>
          QUERY OUT OF STOCK
        </button>
        {isLoading ? (
          <p>Loading</p>
        ) : (
          localsOutOfStock && (
            <InventoryInfo localsOutOfStock={localsOutOfStock} />
          )
        )}
      </div>

      <div>
        <input
          id="products-with-hidden"
          type="checkbox"
          checked={filters.hiddenVariants.status}
          onChange={handleHiddenVariants}
        />
        <label htmlFor="products-with-hidden">hidden variants</label>
        {isLoading ? (
          <p>Loading</p>
        ) : (
          <FilteredSection
            collectionId={collectionId}
            filteredProducts={filteredProducts}
          />
        )}
      </div>
    </div>
  )
}

export default App

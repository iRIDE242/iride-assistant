import React, { useEffect, useState } from 'react'
import {
  createPrevAndNextFromHeader,
  getLocallyOutOfStockProducts,
  getProductsByCollectionId,
  getProductsByPageInfo,
} from './actions/shared'
import './App.css'
import Product from './components/Product'
import InventoryInfo from './components/InventoryInfo'

const collections = {
  210639487136: {
    id: '210639487136',
    name: 'Clearance',
  },
  291229171904: {
    id: '291229171904',
    name: '25% Off Riding Tops',
  },
  291273015488: {
    id: '291273015488',
    name: '20% Off Fox Gloves',
  },
  291274227904: {
    id: '291274227904',
    name: '20% Off Fox Socks',
  },
  291278356672: {
    id: '291278356672',
    name: '20% Off Full Face Helmets',
  },
}

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
  const [products, setProducts] = useState([])
  const [localsOutOfStock, setLocalsOutOfStock] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [collectionId, setCollectionId] = useState('210639487136')
  const [prevAndNext, setPrevAndNext] = useState(initialPrevAndNext)

  useEffect(() => {
    setIsLoading(true)
    getProductsByCollectionId(collectionId)
      .then(({ products, headerObj }) => {
        setProducts(products)
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
  }, [collectionId])

  const handlePrevOrNextClick = direction => async e => {
    setIsLoading(true)
    setLocalsOutOfStock(null)

    try {
      const { prev, next } = prevAndNext
      const link = direction === 'prev' ? prev : next
      const { products, headerObj } = await getProductsByPageInfo(link)
      setProducts(products)

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

  if (!products.length) return <p>Loading...</p>

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

      setProducts(result.products)

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
      </div>

      {isLoading ? (
        <p>Loading</p>
      ) : (
        localsOutOfStock && (
          <InventoryInfo localsOutOfStock={localsOutOfStock} />
        )
      )}
      <h2>
        {collections[collectionId].name.toUpperCase()} [Counts:{' '}
        {products.length}]
      </h2>
      {products.length ? (
        products.map((product, index) => (
          <Product key={index} product={product} />
        ))
      ) : (
        <p>No products from this query</p>
      )}
    </div>
  )
}

export default App

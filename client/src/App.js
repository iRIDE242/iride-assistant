import React, { useEffect, useState } from 'react';
import { createPrevAndNextFromHeader, getLocallyOutOfStockProducts, getProductsByCollectionId, getProductsByPageInfo } from './actions/shared';
import './App.css';
import Product from './components/Product';

const collections = {
  '210639487136': {
    id: '210639487136',
    name: 'Clearance'
  },
  '291229171904': {
    id: '291229171904',
    name: '25% Off Riding Tops'
  }
}


function InventoryInfo({ localsOutOfStock }) {
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
            <p key={p.id}>{p.title}</p>
          ))}
        </div>
      )}
      {partially.length > 0 && (
        <div style={{color: 'orange'}}>
          <h3>Products having out of stock variants [Counts: {partially.length}]</h3>
          {partially.map((p) => (
            <p key={p.id}>{p.title}</p>
          ))}
        </div>
      )}
    </>
  )
}


function App() {
  const [products, setPropducts] = useState([])
  const [localsOutOfStock, setLocalsOutOfStock] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [collectionId, setCollectionId] = useState('210639487136')
  const [prevAndNext, setPrevAndNext] = useState({
    prev: {
      limit: '',
      pageInfo: ''
    },
    next: {
      limit: '',
      pageInfo: ''
    }
  })

  useEffect(() => {
    setIsLoading(true)
    callBackendAPI()
      .then(res => {
        setPropducts(res.products)
        console.log(res)
        console.log(res.headerObj.link)
        
        setPrevAndNext(createPrevAndNextFromHeader(res.headerObj))
        
        return getLocallyOutOfStockProducts(res.products) // A promise
      })
      .then(res => {
        setLocalsOutOfStock(res)
        setIsLoading(false)
      })
      .catch(err => console.log(err))
  }, [collectionId])

  const callBackendAPI = async () => {
    const { products, headerObj } = await getProductsByCollectionId(collectionId)
    
    return {
      products,
      headerObj
    }
  }

  const handlePrevOrNextClick = direction => async e => {
    setIsLoading(true)

    const { prev, next } = prevAndNext
    const { products: newProducts, headerObj } = direction === 'prev'
      ? await getProductsByPageInfo(prev)
      : await getProductsByPageInfo(next)

    setPropducts(newProducts)
    setPrevAndNext(createPrevAndNextFromHeader(headerObj))

    const locallyOutOfStockProducts = await getLocallyOutOfStockProducts(newProducts)

    setLocalsOutOfStock(locallyOutOfStockProducts)
    setIsLoading(false)
  }

  if (!products.length) return (
    <p>Loading...</p>
  )

  const handleSelectChange = e => {
    setCollectionId(e.target.value)
  }

  return (
    <div className="App">
      <div>
        <label htmlFor='collections'>Choose a collection: </label>
        <select 
          name="collections" 
          id="collections" 
          disabled={isLoading}
          value={collectionId}
          onChange={handleSelectChange}
        >
          {Object.values(collections).map(({id, name}) => 
            <option key={id} value={id}>{name}</option>)
          }
        </select>
      </div>
      


      <button 
        disabled={isLoading || !prevAndNext.prev.pageInfo}
        onClick={handlePrevOrNextClick('prev')}>
        PREVIOUS
      </button>
      <button 
        disabled={isLoading || !prevAndNext.next.pageInfo}
        onClick={handlePrevOrNextClick('next')}>
        NEXT
      </button>
      {isLoading 
        ? <p>Loading</p>
        : <InventoryInfo localsOutOfStock={localsOutOfStock} />
      }
      <h2>{collections[collectionId].name.toUpperCase()}</h2>
      {products.length
        ? products.map((product, index) => (
            <Product key={index} product={product} />
          ))
        : <p>No products from this query</p>}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { getLocallyOutOfStockProducts, getProductsByCollectionId } from './actions/shared';
import './App.css';
import Product from './components/Product';

function App() {
  const [products, setPropducts] = useState([])
  const [localsOutOfStock, setLocalsOutOfStock] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    callBackendAPI()
      .then(res => {
        setPropducts(res.products)
        console.log(res)
        
        return getLocallyOutOfStockProducts(res.products) // A promise
      })
      .then(res => {
        setLocalsOutOfStock(res)
        setIsLoading(false)
      })
      .catch(err => console.log(err))
  }, [])

  const callBackendAPI = async () => {
    const { products, responseHeaders } = await getProductsByCollectionId('210639487136')
    
    return {
      products,
      responseHeaders
    }
  }

  if (!products.length) return (
    <p>Loading...</p>
  )

  return (
    <div className="App">
      {isLoading 
        ? <p>Loading</p>
        : localsOutOfStock.length 
            ? localsOutOfStock.map((p, i) => (
                <p key={i}>{p.title}</p>
              ))
            : <p>No products are out of stock locally.</p>
      }
      <h2>PRODUCT LIST</h2>
      {products.length
        ? products.map((product, index) => (
            <Product key={index} product={product} />
          ))
        : <p>No products from this query</p>}
    </div>
  );
}

export default App;

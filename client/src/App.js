import React, { useEffect, useState } from 'react';
import { getLocallyOutOfStockProducts } from './actions/shared';
import './App.css';
import Product from './components/Product';

function App() {
  const [data, setData] = useState(null)
  const [products, setPropducts] = useState([])
  const [localsOutOfStock, setLocalsOutOfStock] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    callBackendAPI()
      .then(res => {
        setData(res.body.express)
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
    const response = await fetch('/express_backend')
    const body = await response.json()

    const shopRes = await fetch('/shopify')
    const shopBody = await shopRes.json()

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return {
      body,
      products: shopBody.objFromShop.products,
      headerObj: shopBody.headerObj
    }
  }

  if (!products.length) return (
    <p>Loading...</p>
  )

  return (
    <div className="App">
      <p className="App-intro">{data}</p>
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

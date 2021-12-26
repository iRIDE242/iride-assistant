import React, { useEffect, useState } from 'react';
import { isLocalNonHiddensOutOfStock } from './actions/productAPIs';
import './App.css';
import Product from './components/Product';

function App() {
  const [data, setData] = useState(null)
  const [products, setPropducts] = useState([])
  const [localsOutOfStock, setLocalsOutOfStock] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    callBackendAPI()
      .then(res => {
        setData(res.body.express)
        setPropducts(res.products)
        console.log(res)
        getLocalsOutOfStock(res.products)


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


  // Functions to handle products API
  

  const isProductActive = product => product.status === 'active'

  const getLocalsOutOfStock = async products => {
    setIsLoading(true)

    const activeProducts = products.filter(isProductActive)

    const localsOutOfStock = []

    for (let index = 0; index < activeProducts.length; index++) {

      if (await isLocalNonHiddensOutOfStock(activeProducts[index])) localsOutOfStock.push(activeProducts[index])
    }

    setLocalsOutOfStock(localsOutOfStock)
    setIsLoading(false)
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

import React, { useEffect, useState } from 'react';
import './App.css';
import Product from './components/Product';
import { pipe } from './utils/functions';

function App() {
  const [data, setData] = useState(null)
  const [products, setPropducts] = useState([])
  const [outOfStockProductsWithNonHiddenVariants, setProductsWithNonHiddenOutOfStockVariants] = useState([])
  const [localsOutOfStock, setLocalsOutOfStock] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    callBackendAPI()
      .then(res => {
        setData(res.body.express)
        setPropducts(res.products)
        setProductsWithNonHiddenOutOfStockVariants(res.products.filter(isProductWithNonHiddenVariantsOutOfStock))
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
  const getProductVariants = product => product.variants

  const isProductArchived = product => product.status === 'archived'

  const isProductActive = product => product.status === 'active'

  const getNonHiddenVariants = variants => variants.filter(variant => variant.weight !== 9999)

  const getVariantInventory = variant => variant.inventory_quantity

  const getTotalInventoryOfNonHiddenVariants = nonHiddenVariants => nonHiddenVariants.map(getVariantInventory).reduce((acc, cur) => acc + cur)

  const isInventoryZero = variant => variant.inventory_quantity <= 0

  const isHiddenVariant = variant => variant.weight === 9999

  const getVariantInventoryItem = variant => variant.inventory_item_id

  const getOutOfStockVariants = variants => variants.filter(isInventoryZero)

  const hasOutOfStockVariants = OutOfStockVariants => OutOfStockVariants.length ? true : false

  const getVariantTitle = variant => variant.title

  const getProductTitle = product => product.title

  const getOutOfStockVariantTitles = variants => variants.map(getVariantTitle)

  const arrayToString = arr => arr.join(', ')


  const getNonHiddenOutOfStockVariants = pipe(
    getProductVariants,
    getNonHiddenVariants,
    getOutOfStockVariants
  )

  const getNonHiddenVariantsFromProduct = pipe(
    getProductVariants,
    getNonHiddenVariants
  )

  const outputOutOfStock = (product, index) => {
    const nonHiddenOutOfStockVariants = getNonHiddenOutOfStockVariants(product)
    
    let productTitle = '', variantTitleString = ''
    
    if (hasOutOfStockVariants(nonHiddenOutOfStockVariants)) {
      variantTitleString = arrayToString(getOutOfStockVariantTitles(nonHiddenOutOfStockVariants))
      productTitle = getProductTitle(product)
  
      console.log(`${productTitle}: ${variantTitleString}`)

      return (
        <li key={index}>{`${productTitle}: ${variantTitleString}`}</li>
      )
    }
  }

  const isProductWithNonHiddenOutOfStockVariants = product => {
    const nonHiddenOutOfStockVariants = getNonHiddenOutOfStockVariants(product)
    return hasOutOfStockVariants(nonHiddenOutOfStockVariants)
  }

  const isLocalOutOfStock = async product => {
    const locationId = '16347136066'
    const nonHiddenVariants = getNonHiddenVariantsFromProduct(product)

    let promiseContainer = []

    for (let index = 0; index < nonHiddenVariants.length; index++) {
      promiseContainer = [
        ...promiseContainer,
        new Promise(res => {
          setTimeout(async () => {
            const inventoryRes = await fetch(`/inventory?location=${locationId}&item=${nonHiddenVariants[index].inventory_item_id}`)
            const { objFromShop } = await inventoryRes.json()

            const { inventory_levels } = objFromShop
            const { available } = inventory_levels[0]
            
            res(available)

          }, 500 * index);
        })
      ]
    }

    const promises = await Promise.all(promiseContainer)
    const nonHiddenStock = promises.reduce((acc, cur) => acc + cur)
    console.log(`${product.title}: ${nonHiddenStock}`)

    return nonHiddenStock <= 0
  }

  const getLocalsOutOfStock = async products => {
    setIsLoading(true)

    const activeProducts = products.filter(isProductActive)

    const localsOutOfStock = []

    for (let index = 0; index < activeProducts.length; index++) {

      if (await isLocalOutOfStock(activeProducts[index])) localsOutOfStock.push(activeProducts[index])
    }

    setLocalsOutOfStock(localsOutOfStock)
    setIsLoading(false)
  } 


  const isProductWithNonHiddenVariantsOutOfStock = product => {
    const nonHiddenVariants = getNonHiddenVariantsFromProduct(product)
    const totalInventoryOfNonHiddenVariants = getTotalInventoryOfNonHiddenVariants(nonHiddenVariants)

    return totalInventoryOfNonHiddenVariants <= 0
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

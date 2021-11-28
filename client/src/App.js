import React, { useEffect, useState } from 'react';
import './App.css';
import { pipe } from './utils/functions';

function App() {
  const [data, setData] = useState(null)
  const [products, setPropducts] = useState([])
  const [outOfStockProductsWithNonHiddenVariants, setProductsWithNonHiddenOutOfStockVariants] = useState([])

  useEffect(() => {
    callBackendAPI()
      .then(res => {
        setData(res.body.express)
        setPropducts(res.products)
        setProductsWithNonHiddenOutOfStockVariants(res.products.filter(isProductWithNonHiddenVariantsOutOfStock))
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
      products: shopBody.objFromShop.products
    }
  }


  // Functions to handle products API
  const getProductVariants = product => product.variants

  const getNonHiddenVariants = variants => variants.filter(variant => variant.weight !== 9999)

  const getVariantInventory = variant => variant.inventory_quantity

  const getTotalInventoryOfNonHiddenVariants = variants => variants.map(getVariantInventory).reduce((acc, cur) => acc + cur)

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

  const isProductWithNonHiddenVariantsOutOfStock = product => {
    const nonHiddenVariants = getNonHiddenVariantsFromProduct(product)
    const totalInventoryOfNonHiddenVariants = getTotalInventoryOfNonHiddenVariants(nonHiddenVariants)

    return totalInventoryOfNonHiddenVariants <= 0
  }

  return (
    <div className="App">
      <p className="App-intro">{data}</p>
      <ul>
        {outOfStockProductsWithNonHiddenVariants.length
          ? outOfStockProductsWithNonHiddenVariants.map((product, index) => 
              <li key={index}>
                <h2>{product.title}</h2>
                <ul>
                  {product.variants.map((variant, index) => 
                    !isHiddenVariant(variant) && isInventoryZero(variant) &&
                      <li key={index}>{getVariantTitle(variant)}</li>  
                  )}
                </ul>
              </li>
            )
          : <li>No out of stock products</li>}
      </ul>
    </div>
  );
}

export default App;

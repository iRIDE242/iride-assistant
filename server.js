require('dotenv').config();

const express = require('express'); 
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express(); 
const port = process.env.PORT || 5000; 

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.API_SECRET_KEY
  }
};

const productAPI = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json'
const collectionClearanceAPI = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?collection_id=210639487136'
const collectionClearanceAPI2 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImxhc3RfaWQiOjY2MzgzMzI5MzYzODQsImxhc3RfdmFsdWUiOiJGb3ggLSA4IEluY2ggUmFuZ2VyIFNvY2tzIFtCbGFja10iLCJkaXJlY3Rpb24iOiJuZXh0In0'
const collectionClearanceAPI3 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2MDgxNzk5MjU4MzA0LCJsYXN0X3ZhbHVlIjoiR2lybyAtIFJhZXMgVGVjaGxhY2UifQ'
const collectionClearanceAPI4 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2MDc3MzYyNjAyMTc2LCJsYXN0X3ZhbHVlIjoiTW9ucyBSb3lhbGUgLSBTdGVsbGEgWC1CYWNrIEJyYSBTUzIxIn0'
const collectionClearanceAPI5 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2OTI1Nzg3NzkxNTUyLCJsYXN0X3ZhbHVlIjoiU3BlY2lhbGl6ZWQgLSBUaGVybWluYWzihKIgQmliIFRpZ2h0cyAtIDIwMjAifQ'

app.get('/shopify', async (req, res) => { 
  const resFromShop = await fetch(collectionClearanceAPI5, options) // fetach returns a Promise
  const objFromShop = await resFromShop.json() // json() method return a Promise, so need to await
  const responseHeaders = resFromShop.headers // This is the response's property, so can be used directly

  let headerObj = { jerry: 'Zhang' }
  for (var pair of responseHeaders.entries()) {
    headerObj[pair[0]] = pair[1]
  }

  res.send({ shopify: 'This should be a Shopify response', objFromShop, headerObj: headerObj }); 
}); 

app.get('/inventory', async (req, res) => { 
  const locationId = req.query.location
  const itemId = req.query.item

  console.log(itemId)

  const resFromShop = await fetch(`https://iride-store.myshopify.com/admin/api/2021-10/inventory_levels.json?inventory_item_ids=${itemId}&location_ids=${locationId}`, options)
  const objFromShop = await resFromShop.json()

  console.log(objFromShop)

  res.send({ objFromShop }); 
}); 

// create a GET route
app.get('/express_backend', (req, res) => { 
  res.send({ mock: 'text', express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 
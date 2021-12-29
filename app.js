import dotenv from 'dotenv'
import fetch from 'node-fetch'
import debugModule from 'debug'
import express from 'express'

dotenv.config()
const debug = debugModule('app')
const app = express()
const port = process.env.PORT || 5000

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.API_SECRET_KEY
  }
};

const productAPI = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json'
const collectionClearanceAPI = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?collection_id=210639487136'
const collectionClearanceAPI2 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImxhc3RfaWQiOjY2ODI5OTI3NzEyNjQsImxhc3RfdmFsdWUiOiJDYXN0ZWxsaSAtIFB1cm8gMyBKZXJzZXkgTWVuJ3MiLCJkaXJlY3Rpb24iOiJuZXh0In0'
const collectionClearanceAPI3 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2MTEyMzY4Njg5MzQ0LCJsYXN0X3ZhbHVlIjoiRm94IC0gRGVmZW5kIFNob3J0cyBbbmF2eV0ifQ'
const collectionClearanceAPI4 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2OTI4MTQwODk0NDAwLCJsYXN0X3ZhbHVlIjoiR2lybyAtIEJsYXplIDIuMCBXaW50ZXIgR2xvdmVzIn0'
const collectionClearanceAPI5 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2MDg3MDM1OTc3OTIwLCJsYXN0X3ZhbHVlIjoiTWF2aWMgLSBDb3NtaWMgRWxpdGUgVVNUIFJpbSBCcmFrZSBXaGVlbHNldCJ9'
const collectionClearanceAPI6 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo1NTA2MjkxMTA1OTUyLCJsYXN0X3ZhbHVlIjoiUkFDRUZBQ0UgLSBNZW4ncyBOYW5vIFBhY2thYmxlIEphY2tldCJ9'
const collectionClearanceAPI7 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo0Mzc3NDc4ODg5NjA4LCJsYXN0X3ZhbHVlIjoiU3BlY2lhbGl6ZWQgLSBUcml2ZW50IFNDIFRyaWF0aGxvbiBTaG9lcyJ9'

app.get('/shopify', async (req, res) => { 
  const resFromShop = await fetch(collectionClearanceAPI3, options) // fetach returns a Promise
  const objFromShop = await resFromShop.json() // json() method return a Promise, so need to await
  const responseHeaders = resFromShop.headers // This is the response's property, so can be used directly

  let headerObj = { jerry: 'Zhang' }
  for (var pair of responseHeaders.entries()) {
    headerObj[pair[0]] = pair[1]
  }
  console.log(headerObj)

  res.send({ shopify: 'This should be a Shopify response', objFromShop, headerObj: headerObj }); 
}); 

app.get('/inventory', async (req, res) => { 
  const locationId = req.query.location
  const itemId = req.query.item

  // console.log(itemId)

  const resFromShop = await fetch(`https://iride-store.myshopify.com/admin/api/2021-10/inventory_levels.json?inventory_item_ids=${itemId}&location_ids=${locationId}`, options)
  const objFromShop = await resFromShop.json()

  // console.log(objFromShop)

  res.send({ objFromShop }); 
}); 

app.listen(port, () => debug(`Listening on port ${port} : )`))
import dotenv from 'dotenv'
import debugModule from 'debug'
import express from 'express'
import { inventoryRouter } from './src/routes/inventoryRoutes.js'
import { productsRouter } from './src/routes/productsRouter.js'

dotenv.config()
const debug = debugModule('app')
const app = express()
const port = process.env.PORT || 5000

const productAPI = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json'
const collectionClearanceAPI = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?collection_id=210639487136'
const collectionClearanceAPI2 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImxhc3RfaWQiOjY2ODI5OTI3NzEyNjQsImxhc3RfdmFsdWUiOiJDYXN0ZWxsaSAtIFB1cm8gMyBKZXJzZXkgTWVuJ3MiLCJkaXJlY3Rpb24iOiJuZXh0In0'
const collectionClearanceAPI3 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2MTEyMzY4Njg5MzQ0LCJsYXN0X3ZhbHVlIjoiRm94IC0gRGVmZW5kIFNob3J0cyBbbmF2eV0ifQ'
const collectionClearanceAPI4 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2OTI4MTQwODk0NDAwLCJsYXN0X3ZhbHVlIjoiR2lybyAtIEJsYXplIDIuMCBXaW50ZXIgR2xvdmVzIn0'
const collectionClearanceAPI5 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo2MDg3MDM1OTc3OTIwLCJsYXN0X3ZhbHVlIjoiTWF2aWMgLSBDb3NtaWMgRWxpdGUgVVNUIFJpbSBCcmFrZSBXaGVlbHNldCJ9'
const collectionClearanceAPI6 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo1NTA2MjkxMTA1OTUyLCJsYXN0X3ZhbHVlIjoiUkFDRUZBQ0UgLSBNZW4ncyBOYW5vIFBhY2thYmxlIEphY2tldCJ9'
const collectionClearanceAPI7 = 'https://iride-store.myshopify.com/admin/api/2021-10/products.json?limit=50&page_info=eyJjb2xsZWN0aW9uX2lkIjoyMTA2Mzk0ODcxMzYsImRpcmVjdGlvbiI6Im5leHQiLCJsYXN0X2lkIjo0Mzc3NDc4ODg5NjA4LCJsYXN0X3ZhbHVlIjoiU3BlY2lhbGl6ZWQgLSBUcml2ZW50IFNDIFRyaWF0aGxvbiBTaG9lcyJ9'

app.use('/inventory', inventoryRouter)
app.use('/products', productsRouter)

app.listen(port, () => debug(`Listening on port ${port} : )`))
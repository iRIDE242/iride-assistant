import dotenv from 'dotenv'
import debugModule from 'debug'
import express from 'express'
import { inventoryRouter } from './src/routes/inventoryRoutes.js'
import { productsRouter } from './src/routes/productsRouter.js'
import { variantRouter } from './src/routes/variantRoutes.js'

dotenv.config()
const debug = debugModule('app')
const app = express()
const port = process.env.PORT || 5000

app.use('/inventory', inventoryRouter)
app.use('/products', productsRouter)
app.use('/variant', variantRouter)

// Ths async error handling needs to be after routes since this happens after api requests
app.use((err, req, res, next) => {
  debug('Error Handling Middleware called')
  debug('Path: ', req.path)
  debug(err.message)

  let error = err

  // This is for network error
  if (err.name === 'FetchError') {
    error = new Error(err.message)
    error.status = 500
  }

  // Note, need to use error.message for the error text content.
  // Since the client side uses fetch, the sent target needs to be either an object
  // or a json stringified primitive value to match with response.json() method.
  res.status(error.status).send(JSON.stringify(error.message))
})

app.listen(port, () => debug(`Listening on port ${port} : )`))

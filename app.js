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
app.use((error, req, res, next) => {
  debug('Error Handling Middleware called')
  debug('Path: ', req.path)

  // Note, need to use error.message for the error text content
  res.status(error.status).send(JSON.stringify(error.message))
})

app.listen(port, () => debug(`Listening on port ${port} : )`))

import dotenv from 'dotenv'
import debugModule from 'debug'
import express from 'express'
import { inventoryRouter } from './src/routes/inventoryRoutes.js'
import { productsRouter } from './src/routes/productsRouter.js'

dotenv.config()
const debug = debugModule('app')
const app = express()
const port = process.env.PORT || 5000

app.use('/inventory', inventoryRouter)
app.use('/products', productsRouter)

app.listen(port, () => debug(`Listening on port ${port} : )`))
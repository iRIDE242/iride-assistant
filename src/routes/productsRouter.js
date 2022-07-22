import express from 'express'
import { productsController } from '../controllers/productsController.js'

export const productsRouter = express.Router()
const { middleware, getProductsAndResponseHeader } = productsController()

// Method 1 - a tidy but not a general and robust written style
// This actually is just implementing middleware
// since getProductsAndResponseHeader can be treated as a special middleware.
// In this case we can write it this way
// but it doesn't mean it will work in other places.
// Omitting path means the root path.
// productsRouter.use(middleware, getProductsAndResponseHeader)


// Method 2 - use GET, same as above
// This is more readable and the recommended way
productsRouter.get('/', middleware, getProductsAndResponseHeader)


// Method 3 - another written style from method 2
// The implementation of middleware is under GET method.
// So we'd better put middleware under GET method.
// That's why Method 2 is recommended.
// productsRouter.use(middleware) 
// productsRouter
//   .get('/', getProductsAndResponseHeader)
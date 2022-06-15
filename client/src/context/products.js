import { createCtx } from '../utils/helper'

const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
const GET_PRODUCTS = 'GET_PRODUCTS'

const [useProducts, ProductsProvider] = createCtx('<Products />', 'Products')

const productsReducer = (state, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return action.products
    case UPDATE_PRODUCT:
      return state.map(product => {
        if (product.id === action.updatedProduct.id) return action.product
        return product
      })
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

const getProducts = (dispatch, products) => {
  dispatch({ type: GET_PRODUCTS, products })
}

const updateProduct = (dispatch, updatedProduct) => {
  dispatch({ type: UPDATE_PRODUCT, updatedProduct })
}

export {
  useProducts,
  ProductsProvider,
  productsReducer,
  getProducts,
  updateProduct,
}

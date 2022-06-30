import { createCtx, numberToString } from '../utils/helper'

const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
const GET_PRODUCTS = 'GET_PRODUCTS'
const TOGGLE_HIDDENS = 'TOGGLE_HIDDENS'
const UPDATE_PRODUCTS = 'UPDATE_PRODUCTS'

const [useProducts, ProductsProvider] = createCtx('<Products />', 'Products')

const productsReducer = (state, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.products,
      }
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: new Map(
          state.products.set(action.key, action.updatedProduct)
        ),
      }
    case UPDATE_PRODUCTS:
      for (let index = 0; index < action.updatedProducts.length; index++) {
        state.products.set(
          numberToString(action.updatedProducts[index].id),
          action.updatedProducts[index]
        )
      }
      return {
        ...state,
        products: new Map(state.products),
      }
    case TOGGLE_HIDDENS:
      return {
        ...state,
        filters: {
          ...state.filters,
          hiddenVariants: {
            ...state.filters.hiddenVariants,
            status: !state.filters.hiddenVariants.status,
          },
        },
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

const getProducts = (dispatch, products) => {
  dispatch({ type: GET_PRODUCTS, products })
}

const updateProduct = (dispatch, updatedProduct) => {
  const key = numberToString(updatedProduct.id)
  dispatch({ type: UPDATE_PRODUCT, updatedProduct, key })
}

const updateProducts = (dispatch, updatedProducts) => {
  dispatch({ type: UPDATE_PRODUCTS, updatedProducts })
}

const toggleHiddens = dispatch => {
  dispatch({ type: TOGGLE_HIDDENS })
}

export {
  useProducts,
  ProductsProvider,
  productsReducer,
  getProducts,
  updateProduct,
  toggleHiddens,
  updateProducts,
}

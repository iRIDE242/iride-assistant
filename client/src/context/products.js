import { createCtx } from '../utils/helper'

const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
const GET_PRODUCTS = 'GET_PRODUCTS'
const TOGGLE_HIDDENS = 'TOGGLE_HIDDENS'

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
        products: state.products.map(product => {
          if (product.id === action.updatedProduct.id)
            return action.updatedProduct
          return product
        }),
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
  dispatch({ type: UPDATE_PRODUCT, updatedProduct })
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
}

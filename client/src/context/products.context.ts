import { Dispatch } from 'react'
import { numberToString } from '../utils/helper'
import { createCtx } from './helpers/products.helper'
import { Action, ActionTypes, ProductsState } from './types'
import { hasHidden } from 'actions/product.action'
import { isHidden } from 'actions/variant'
import { Product } from 'components/types'

export const initialProducts: ProductsState = {
  products: new Map(),
  filters: {
    hiddenVariants: {
      status: false,
      filter: hasHidden, // On each product
      variantFilter: isHidden, // On each variant
    },
  },
}

const [useProducts, productsContext] = createCtx<
  [ProductsState, Dispatch<Action>]
>('<Products />', 'Products')

export const productsReducer = (state: ProductsState, action: Action) => {
  switch (action.type) {
    case ActionTypes.GET_PRODUCTS:
      return {
        ...state,
        products: action.products,
      }
    case ActionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: new Map(
          state.products.set(action.key, action.updatedProduct)
        ),
      }
    case ActionTypes.UPDATE_PRODUCTS:
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
    case ActionTypes.TOGGLE_HIDDENS:
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
      throw new Error('Unknown action type')
  }
}

export const getProducts = (
  dispatch: Dispatch<Action>,
  products: ProductsState['products']
) => {
  dispatch({ type: ActionTypes.GET_PRODUCTS, products })
}

export const updateProduct = (
  dispatch: Dispatch<Action>,
  updatedProduct: Product
) => {
  const key = numberToString(updatedProduct.id)
  dispatch({ type: ActionTypes.UPDATE_PRODUCT, updatedProduct, key })
}

export const updateProducts = (
  dispatch: Dispatch<Action>,
  updatedProducts: Product[]
) => {
  dispatch({ type: ActionTypes.UPDATE_PRODUCTS, updatedProducts })
}

export const toggleHiddens = (dispatch: Dispatch<Action>) => {
  dispatch({ type: ActionTypes.TOGGLE_HIDDENS })
}

export { useProducts, productsContext }

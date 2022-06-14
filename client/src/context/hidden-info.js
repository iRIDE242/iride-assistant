import { createCtx } from '../utils/helper'

const SHOW_SINGLE = 'SHOW_SINGLE'

const [useHiddenInfo, HiddenInfoProvider] = createCtx(
  '<HiddenInfo />',
  'HiddenInfo'
)

const hiddenInfoReducer = (state, action) => {
  switch (action.type) {
    case SHOW_SINGLE:
      return state.map(product => {
        if (product.id === action.updatedProduct.id) return action.product
        return product
      })
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

const showSingle = (dispatch, updatedProduct) => {
  dispatch({ type: SHOW_SINGLE, updatedProduct })
}

export { useHiddenInfo, HiddenInfoProvider, hiddenInfoReducer, showSingle }

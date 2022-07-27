import { Product, Variant } from 'components/types'
import { ReactNode } from 'react'

export enum ActionTypes {
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
  GET_PRODUCTS = 'GET_PRODUCTS',
  TOGGLE_HIDDENS = 'TOGGLE_HIDDENS',
  UPDATE_PRODUCTS = 'UPDATE_PRODUCTS',
}

export type Action =
  | { type: ActionTypes.GET_PRODUCTS; products: ProductsState['products'] }
  | { type: ActionTypes.TOGGLE_HIDDENS }
  | { type: ActionTypes.UPDATE_PRODUCT; key: string; updatedProduct: Product }
  | { type: ActionTypes.UPDATE_PRODUCTS; updatedProducts: Product[] }

export interface ProductsProps {
  children: ReactNode
}

interface Filter {
  status: boolean
  filter: (product: Product) => boolean
  variantFilter: (variant: Variant) => boolean
}

export interface ProductsState {
  filters: {
    [propName: string]: Filter
  }
  products: Map<string, Product>
}

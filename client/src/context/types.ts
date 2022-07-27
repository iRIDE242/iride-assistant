import { Product, Variant } from 'components/types'
import { ReactNode } from 'react'

export enum Actions {
  UPDATE_PRODUCT,
  GET_PRODUCTS,
  TOGGLE_HIDDENS,
  UPDATE_PRODUCTS,
}

export interface ProductsProps {
  children: ReactNode
}

interface Filter {
  status: boolean
  filter: (product: Product) => boolean
  variantFilter: (variant: Variant) => boolean
}

export interface ProductState {
  filters: {
    [propName: string]: Filter
  }
  products: Map<string, Product>
}

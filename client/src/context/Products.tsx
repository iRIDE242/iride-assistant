import { hasHidden } from 'actions/product'
import { isHidden } from 'actions/variant'
import { ProductsProps, ProductState } from './types'

const initialProducts: ProductState = {
  products: new Map(),
  filters: {
    hiddenVariants: {
      status: false,
      filter: hasHidden, // On each product
      variantFilter: isHidden, // On each variant
    },
  }
}

export default function Products({ children }: ProductsProps) {
  return <></>
}

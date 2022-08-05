import { Product } from 'components/types'

export enum From {
  ITEM = 'item',
  VENDOR = 'vendor',
}

export interface ProductProps {
  product: Product
  fromInventory: boolean
  notIgnored?: boolean
  isIgnored?: boolean
  handleAddToIgnored?: (id: Product['id']) => void
  handleRemoveFromIgnored?: (id: Product['id']) => void
  from?: From
}

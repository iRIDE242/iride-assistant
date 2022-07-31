export enum HiddenStatus {
  NO_HIDDEN = 'no hidden',
  HAS_HIDDEN = 'has hidden',
}

export enum InventoryStatus {
  IN_STOCK = 'in stock',
  PARTIALLY_OUT = 'has variants out of stock',
  OUT_OF_STOCK = 'out of stock',
}

export interface InventoryLevel {
  inventory_item_id: number
  location_id: number
  available: number
  updated_at: Date
  admin_graphql_api_id: string
}

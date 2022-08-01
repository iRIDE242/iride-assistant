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

export enum Directions {
  NEXT = 'next',
  PREVIOUS = 'previous',
}

// Regex named capture groups
// https://github.com/microsoft/TypeScript/issues/32098#issuecomment-922114332
type MatchedHeaderWithGroupsOnly<T> = {
  groups: {
    [key in keyof T]: string
  }
}

export type MatchedResult<T> =
  | (RegExpExecArray & MatchedHeaderWithGroupsOnly<T>)
  | null

export interface Header {
  'alt-svc': string
  'cf-cache-status': string
  'cf-ray': string
  connection: string
  'content-encoding': string
  'content-security-policy': string
  'content-type': string
  date: string
  'expect-ct': string
  http_x_shopify_shop_api_call_limit: string
  link: string
  'referrer-policy': string
  server: string
  'strict-transport-security': string
  'transfer-encoding': string
  vary: string
  'x-content-type-options': string
  'x-dc': string
  'x-download-options': string
  'x-frame-options': string
  'x-permitted-cross-domain-policies': string
  'x-request-id': string
  'x-shardid': string
  'x-shopid': string
  'x-shopify-api-terms': string
  'x-shopify-api-version': string
  'x-shopify-shop-api-call-limit': string
  'x-shopify-stage': string
  'x-sorting-hat-podid': string
  'x-sorting-hat-shopid': string
  'x-stats-apiclientid': string
  'x-stats-apipermissionid': string
  'x-stats-userid': string
  'x-xss-protection': string
}

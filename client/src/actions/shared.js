import { filter, pipe, prop } from "ramda";
import { areLocalNonHiddensOutOfStock, isActive } from "./productAPIs";

/**
 * Shared properties
 */
export const getTitle = prop('title')




/**
 * API requests
 */

/**
 * Get products that are active and locally out of stock
 * @param {Array} products 
 * @returns {Array}
 */
export const getLocallyOutOfStockProducts = async products => {
  const activeProducts = filter(isActive)(products)

  const activeLocallyOutOfStockProducts = []

  for (let index = 0; index < activeProducts.length; index++) {
    if (await areLocalNonHiddensOutOfStock(activeProducts[index])) activeLocallyOutOfStockProducts.push(activeProducts[index])
  }

  return activeLocallyOutOfStockProducts
}

export const getProductsByCollectionId = async collectionId => {
  const response = await fetch(`/products?collection_id=${collectionId}`)
  return response.json()
}

export const getProductsByPageInfo = async ({ limit, pageInfo }) => {
  const response = await fetch(`/products?limit=${limit}&page_info=${pageInfo}`)
  return response.json()
}


/**
 * Response header manipulation
 */

const emptyLink = {
  limit: '',
  pageInfo: ''
}

const regexGeneratorForLink = direction => {
  const base = `<https:\\/\\/[\\w\\d-]+\\.myshopify\\.com\\/admin\\/api\\/[\\d]{4}-[\\d]{2}\\/products\\.json\\?limit=(?<limit>[\\d]+)&page_info=(?<pageInfo>[\\w\\d]+)>;\\srel="${direction}"`
  return new RegExp(base, 'i')
}

const regexNext = regexGeneratorForLink('next')
const regexPrev = regexGeneratorForLink('previous')

const getLink = prop('link')

const getPrevMatched = link => regexPrev.exec(link)
const getNextMatched = link => regexNext.exec(link)

const getPageLink = matchedResult => {
  if (matchedResult === null) return emptyLink

  const { groups: { limit, pageInfo }} = matchedResult
  return {
    limit, 
    pageInfo
  }
}

export const createPrevAndNextFromHeader = header => {
  return {
    prev: pipe(getLink, getPrevMatched, getPageLink)(header),
    next: pipe(getLink, getNextMatched, getPageLink)(header)
  }
}

import { filter, pipe, prop } from 'ramda'
import {
  areLocalNonHiddensOutOfStock,
  hasHidden,
  isActive,
} from './productAPIs'

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
  const activeLocallyHavingOutOfStockProducts = []

  try {
    for (let index = 0; index < activeProducts.length; index++) {
      const status = await areLocalNonHiddensOutOfStock(activeProducts[index])

      if (status === 'out of stock')
        activeLocallyOutOfStockProducts.push(activeProducts[index])
      if (status === 'has variants out of stock')
        activeLocallyHavingOutOfStockProducts.push(activeProducts[index])
    }

    return {
      activeLocallyOutOfStockProducts,
      activeLocallyHavingOutOfStockProducts,
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getProductsByCollectionId = async collectionId => {
  try {
    const response = await fetch(`/products?collection_id=${collectionId}`)
    return response.json()
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getProductsByPageInfo = async ({ limit, pageInfo }) => {
  try {
    const response = await fetch(
      `/products?limit=${limit}&page_info=${pageInfo}`
    )
    return response.json()
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Response header manipulation
 */

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
  if (matchedResult === null)
    return {
      limit: '',
      pageInfo: '',
    }

  const {
    groups: { limit, pageInfo },
  } = matchedResult
  return {
    limit,
    pageInfo,
  }
}

export const createPrevAndNextFromHeader = header => {
  return {
    prev: pipe(getLink, getPrevMatched, getPageLink)(header),
    next: pipe(getLink, getNextMatched, getPageLink)(header),
  }
}

export const getProductsWithHiddenVariants = products => {
  const activeProducts = filter(isActive)(products)

  const productsHavingHiddenvariants = []

  for (let index = 0; index < activeProducts.length; index++) {
    hasHidden(activeProducts[index]) === 'has hidden' &&
      productsHavingHiddenvariants.push(activeProducts[index])
  }

  return productsHavingHiddenvariants
}

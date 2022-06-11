import { filter, pipe, prop } from 'ramda'
import { hasHidden, isActive } from './productAPIs'

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

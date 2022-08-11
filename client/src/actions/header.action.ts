import { pipe, prop } from 'ramda'
import { Directions, Header, MatchedResult } from './types'

const regexGeneratorForLink = (direction: string) => {
  const base = `<https:\\/\\/[\\w\\d-]+\\.myshopify\\.com\\/admin\\/api\\/[\\d]{4}-[\\d]{2}\\/products\\.json\\?limit=(?<limit>[\\d]+)&page_info=(?<pageInfo>[\\w\\d]+)>;\\srel="${direction}"`
  return new RegExp(base, 'i')
}

const regexNext = regexGeneratorForLink(Directions.NEXT)
const regexPrev = regexGeneratorForLink(Directions.PREVIOUS)

const getLink: (header: Header) => string = prop('link')

const getPrevMatched = (link: string) =>
  regexPrev.exec(link) as MatchedResult<{ limit: string; pageInfo: string }>
const getNextMatched = (link: string) =>
  regexNext.exec(link) as MatchedResult<{ limit: string; pageInfo: string }>

const getPageLink = (
  matchedResult: MatchedResult<{ limit: string; pageInfo: string }>
) => {
  if (matchedResult === null) return { limit: '', pageInfo: '' }

  const {
    groups: { limit, pageInfo },
  } = matchedResult
  return { limit, pageInfo }
}

// Get prev and next page info from the response header
export const createPrevAndNextFromHeader = (header: Header) => {
  return {
    prev: pipe(getLink, getPrevMatched, getPageLink)(header),
    next: pipe(getLink, getNextMatched, getPageLink)(header),
  }
}

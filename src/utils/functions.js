import { pipe, prop } from "ramda";

const getQuery = prop('query')
const getCollectionId = prop('collection_id')
const getPageInfo = prop('page_info')
const getLimit = prop('limit')

export const getQueryCollectionId = pipe(getQuery, getCollectionId)
export const getQueryPageInfo = pipe(getQuery, getPageInfo)
export const getQueryLimit = pipe(getQuery, getLimit)

export const handleHeaders = headers => {
  const headerObj = {}
  for (var pair of headers.entries()) {
    headerObj[pair[0]] = pair[1]
  }
  return headerObj
}
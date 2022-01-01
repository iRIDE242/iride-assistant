import { pipe, prop } from "ramda";

const getQuery = prop('query')
const getCollectionId = prop('collection_id')
const getPageInfo = prop('page_info')

export const getQueryCollectionId = pipe(getQuery, getCollectionId)
export const getQueryPageInfo = pipe(getQuery, getPageInfo)

export const handleHeaders = headers => {
  const headerObj = {}
  for (var pair of headers.entries()) {
    headerObj[pair[0]] = pair[1]
  }
  return headerObj
}
import { pipe, prop } from "ramda";

const getQuery = prop('query')
const getCollectionId = prop('collection_id')
const getPageInfo = prop('page_info')

export const getQueryCollectionId = pipe(getQuery, getCollectionId)
export const getQueryPageInfo = pipe(getQuery, getPageInfo)
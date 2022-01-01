import { pipe, prop } from "ramda";

const getQuery = prop('query')
const getCollection = prop('collection')
const getPageInfo = prop('page_info')

export const getQueryCollection = pipe(getQuery, getCollection)
export const getQueryPageInfo = pipe(getQuery, getPageInfo)
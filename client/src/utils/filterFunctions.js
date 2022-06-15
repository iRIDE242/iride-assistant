import { filter, pipe } from 'ramda'
import { getHiddens } from '../actions/productAPIs'

const filterAll = () => false

const hasHidden = product => {
  const hiddens = getHiddens(product)
  return hiddens.length > 0
}

const getAllFilters = filterFuncs => {
  return filterFuncs.length > 0 ? pipe(...filterFuncs.map(filter)) : filter(filterAll)
}

export { filterAll, hasHidden, getAllFilters }

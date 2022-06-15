import { filter, pipe } from 'ramda'
import { getHiddens } from '../actions/productAPIs'

const filterAll = () => false

const hasHidden = product => {
  const hiddens = getHiddens(product)
  return hiddens.length > 0
}

const getAllFilters = filterFuncs => {
  return filterFuncs.length > 0
    ? filterFuncs.length > 1
      ? pipe(...filterFuncs.map(filter))
      : filter(filterFuncs[0])
    : filter(filterAll)
}

export { filterAll, hasHidden, getAllFilters }

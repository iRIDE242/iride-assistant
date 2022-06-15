import { filter, pipe } from 'ramda'
import { getHiddens } from '../actions/productAPIs'

const filterAll = () => false

const hasHidden = product => {
  const hiddens = getHiddens(product)
  return hiddens.length > 0
}

const getAllFilters = filterFuncs => {
  return filterFuncs.length > 0
    // Note, in map, the ramda 'filter' actually will return a function that receive an array as paramter to be invoked.
    // It is equal to arr => arr.filter(func) shown below.
    // So it cannot be written as 'filterFuncs.map(filter)'.
    ? pipe(...filterFuncs.map(filterFunc => filter(filterFunc)))
    : filter(filterAll)
}

// This is the way not using ramda filter method but only js
// const getAllFilters = filterFuncs => {
//   return filterFuncs.length > 0
//     ? pipe(...filterFuncs.map(func => arr => arr.filter(func)))
//     : filter(filterAll)
// }

export { filterAll, hasHidden, getAllFilters }

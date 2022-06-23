import { prop } from 'ramda'
import { createContext, useContext } from 'react'

/**
 * Shared methods
 */
const getTitle = prop('title')
export const getLength = prop('length')

/**
 * Create sequenced promises
 */
const createDelayByIndexForPromise = (delay, index) => passPromiseParams => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      passPromiseParams(res, rej)
    }, delay * index)
  })
}

const createSequencedPromises = (
  arr,
  createPromiseRelay,
  delaySetting = 500
) => {
  const delay = delaySetting < 500 ? 500 : delaySetting

  let promiseContainer = []
  let legidIndex = 0

  for (let index = 0; index < arr.length; index++) {
    const passPromiseParams = createPromiseRelay(arr[index])

    if (!passPromiseParams) continue

    const receiveRelayToPassParams = createDelayByIndexForPromise(
      delay,
      legidIndex
    )
    const sequencedPromise = receiveRelayToPassParams(passPromiseParams)

    promiseContainer.push(sequencedPromise)
    legidIndex++
  }

  return promiseContainer
}

const handleFetch = async url => {
  try {
    // response is a fetch report file describing how this fetch goes,
    // with properties like status, ok, statusText,
    // and json method to get the returned data.
    const response = await fetch(url)
    const result = await response.json()

    if (!response.ok) throw new Error(result)

    return result
  } catch (error) {
    throw error
  }
}

function createCtx(providerName, displayName) {
  const ctx = createContext(undefined)

  if (ctx && displayName) {
    ctx.displayName = displayName
  }

  function useCtx(componentName = 'Consumer components') {
    const c = useContext(ctx)
    if (c === undefined)
      throw new Error(
        `${componentName} must be inside ${providerName} with a value`
      )
    return c
  }
  return [useCtx, ctx.Provider]
}

const mapValueToArray = map => [...map.values()]

const arrayToMapWithIdAsKey = arr => {
  const map = new Map()
  arr.map(a => map.set(a.id.toString(), a))
  return map
}

export {
  getTitle,
  createSequencedPromises,
  handleFetch,
  createCtx,
  mapValueToArray,
  arrayToMapWithIdAsKey,
}

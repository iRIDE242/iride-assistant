import { prop } from 'ramda'

/**
 * Shared methods
 */
const getTitle = prop('title')

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

export { getTitle, createSequencedPromises, handleFetch }

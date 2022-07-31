/**
 * Create sequenced promises
 */
const createDelayByIndexForPromise =
  (delay: number, index: number) =>
  <T>(promiseRequest: Promise<T>) => {
    return new Promise<T>((res, rej) => {
      setTimeout(() => {
        promiseRequest.then(res).catch(rej)
      }, delay * index)
    })
  }

export const createSequencedPromises = <T, U>(
  arr: Array<T>,
  createPromiseRequest: (param: T) => Promise<U>,
  delaySetting: number = 500
) => {
  const delay = delaySetting < 500 ? 500 : delaySetting

  let promiseContainer: Array<Promise<U>> = []
  let legidIndex: number = 0

  for (let index = 0; index < arr.length; index++) {
    const promiseRequest = createPromiseRequest(arr[index])

    if (!promiseRequest) continue

    const receivePromise = createDelayByIndexForPromise(delay, legidIndex)
    const sequencedPromise = receivePromise(promiseRequest)

    promiseContainer.push(sequencedPromise)
    legidIndex++
  }

  return promiseContainer
}

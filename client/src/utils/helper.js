import { prop } from 'ramda'

export const getTitle = prop('title')

export const getLength = prop('length')

/**
 * Helper function for fetch to solve no error response except network error
 */
export const handleFetch = async url => {
  try {
    // response is a fetch report file describing how this fetch goes,
    // with properties like status, ok, statusText,
    // and json method to get the returned data.
    const response = await fetch(url)
    const result = await response.json()

    // Error from requests
    if (!response.ok) throw new Error(result)

    return result
  } catch (error) {
    throw error
  }
}

export const handleFetchPost = async (url, data) => {
  console.log(data)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()

    if (!response.ok) throw new Error(result)

    return result
  } catch (error) {
    throw error
  }
}

export const numberToString = num => num.toString()

export const mapValueToArray = map => [...map.values()]

export const arrayToMapWithIdAsKey = arr => {
  const map = new Map()
  arr.map(a => map.set(numberToString(a.id), a))
  return map
}

export const createTwoDigitString = numStr => Number(numStr).toFixed(2)

export const toggleBlock = condition => ({
  display: condition ? 'block' : 'none',
})

export const updateParentCheckbox = (
  checked,
  fromParent,
  setParentCheckbox
) => {
  if (checked) {
    if (fromParent === false && setParentCheckbox !== undefined) {
      setParentCheckbox(current => {
        const nextSelected = current.selected + 1

        return {
          ...current,
          checked: nextSelected >= current.max ? true : current.checked,
          selected: nextSelected >= current.max ? current.max : nextSelected,
        }
      })
    }
  } else {
    if (fromParent === false && setParentCheckbox !== undefined)
      setParentCheckbox(current => {
        const nextSelected = current.selected - 1

        return {
          ...current,
          checked: nextSelected <= 0 ? false : current.checked,
          selected: nextSelected <= 0 ? 0 : nextSelected,
        }
      })
  }
}

export const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

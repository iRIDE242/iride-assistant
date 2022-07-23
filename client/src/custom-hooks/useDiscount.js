import { useEffect, useState } from 'react'

export const SHOW_INITIAL = 'SHOW INITIAL'
export const STAY_SYNCED = 'STAY SYNCED'
export const KEEP_VALUE = 'KEEP VALUE'

export const useDiscount = discountFromAbove => {
  const [discount, setDiscount] = useState({
    status: SHOW_INITIAL,
    value: '',
  })

  const handleSetDiscount = e => {
    const discount = e.target.value

    // Number input will only responde legid inputs (number or blank space '')
    // Illegal inputs will only trigger the event once when input converts from legid to illegal status,
    // and the event value will be a blank space ''.
    // then any further illegal inputs won't trigger event any more.
    setDiscount({
      status: STAY_SYNCED,
      value: discount === '' ? discount : Number(discount),
    })
  }

  useEffect(() => {
    if (discountFromAbove) {
      const { status, value } = discountFromAbove
      if (status !== SHOW_INITIAL)
        setDiscount(current => ({
          status: status,
          value: status === STAY_SYNCED ? value : current.value,
        }))
    }
  }, [discountFromAbove])

  return [discount, handleSetDiscount, setDiscount]
}

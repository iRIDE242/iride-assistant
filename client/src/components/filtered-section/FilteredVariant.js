import { useEffect, useRef, useState } from 'react'
import { getVariantById } from '../../utils/api'
import { idGroups, idRoles } from '../../utils/config'
import { useChildCheckbox } from '../../utils/customHooks'
import { createTwoDigitString } from '../../utils/helper'
import {
  arePriceSettingsIdentical,
  getDiscountedPrice,
  getOriginalPrice,
  getPriceSetting,
} from '../../utils/helpers/filterVariant'

export default function FilteredVariant({
  product,
  variant,
  checkedFromProduct,
  fromSection,
  setCheckboxFromProduct,
  setCheckboxFromSection,
  discountFromProduct,
  resetFromProduct,
  isSelectedOnly,
}) {
  const [checkbox, handleChange] = useChildCheckbox(
    checkedFromProduct,
    setCheckboxFromProduct,
    setCheckboxFromSection,
    fromSection
  )

  const [originalPriceSetting, setOriginalPriceSetting] = useState(() =>
    getPriceSetting(variant)
  )

  const [priceSetting, setPriceSetting] = useState({
    price: 0.0,
    cap: '',
    discount: '',
  })

  const reset = useRef(0)

  const modifyDiscount = e => {
    const { price, cap } = originalPriceSetting

    const originalPrice = getOriginalPrice(price, cap)
    const discountNumber = Number(e.target.value)

    setPriceSetting({
      price: discountNumber
        ? getDiscountedPrice(discountNumber, originalPrice)
        : originalPrice,
      cap: discountNumber ? originalPrice : '',
      discount: e.target.value === '' ? e.target.value : discountNumber,
    })
  }

  const resetPriceSetting = e => {
    e.preventDefault()
    setPriceSetting(originalPriceSetting)
  }

  const handleGetVariant = variantId => async e => {
    e.preventDefault()
    console.log(variantId)
    try {
      const variant = await getVariantById(variantId)
      console.log(variant)
    } catch (error) {
      throw error
    }
  }

  // Check if original setting changes when variant changes
  useEffect(() => {
    if (!arePriceSettingsIdentical(originalPriceSetting, variant)) {
      console.log('not identical')
      setOriginalPriceSetting(getPriceSetting(variant))
    }
  }, [originalPriceSetting, variant])

  // Sync the discount change from product
  useEffect(() => {
    isSelectedOnly
      ? checkbox.checked &&
        setPriceSetting(current =>
          getPriceSetting(variant, discountFromProduct, current)
        )
      : setPriceSetting(current =>
          getPriceSetting(variant, discountFromProduct, current)
        )
  }, [checkbox.checked, discountFromProduct, isSelectedOnly, variant])

  // Responde to the reset from product
  useEffect(() => {
    if (reset.current !== resetFromProduct) {
      console.log('reset from product')
      reset.current = resetFromProduct
      setPriceSetting(originalPriceSetting)
    }
  }, [originalPriceSetting, resetFromProduct])

  return (
    <div className="variant--wrapper">
      <div className="variant--title">
        {/* Variant checkbox */}
        <input
          type="checkbox"
          id={`${idGroups.variant}--${idRoles.handler}-${variant.id}`}
          checked={checkbox.checked}
          onChange={handleChange}
        />
        <label
          htmlFor={`${idGroups.variant}--${idRoles.handler}-${variant.id}`}
        >{`${product.title} - ${variant.title}`}</label>

        <button onClick={handleGetVariant(variant.id)}>GET VARIANT</button>
      </div>

      <div className="variant--price">
        <label
          style={{ marginLeft: '4px' }}
          htmlFor={`${idGroups.variant}--${idRoles.discount}-${variant.id}`}
        >
          <strong>Discount: </strong>
        </label>
        <input
          id={`${idGroups.variant}--${idRoles.discount}-${variant.id}`}
          style={{ width: '40px' }}
          type="number"
          value={priceSetting.discount}
          onChange={modifyDiscount}
          min="0"
          max="100"
        />
        <span>%</span>

        <label
          style={{ marginLeft: '4px' }}
          htmlFor={`${idGroups.variant}--${idRoles.price}-${variant.id}`}
        >
          <strong>Price: </strong>
        </label>
        <input
          id={`${idGroups.variant}--${idRoles.price}-${variant.id}`}
          type="text"
          value={createTwoDigitString(priceSetting.price)}
          readOnly
          style={{ width: '50px' }}
        />

        <label
          style={{ marginLeft: '4px' }}
          htmlFor={`${idGroups.variant}--${idRoles.cap}-${variant.id}`}
        >
          <strong>CAP: </strong>
        </label>
        <input
          id={`${idGroups.variant}--${idRoles.cap}-${variant.id}`}
          type="text"
          value={priceSetting.cap ? createTwoDigitString(priceSetting.cap) : ''}
          readOnly
          style={{ width: '50px' }}
        />

        <button onClick={resetPriceSetting}>RESET PRICE SETTING</button>
      </div>
    </div>
  )
}

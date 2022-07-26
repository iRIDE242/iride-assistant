import { useEffect, useRef, useState } from 'react'
import { useChildCheckbox } from '../../custom-hooks/useChildCheckbox'
import { KEEP_VALUE } from '../../custom-hooks/useDiscount'
import usePriceSetting from '../../custom-hooks/usePriceSetting'
import { getVariantById } from '../../utils/api'
import { idGroups, idRoles } from '../../utils/config'
import { createTwoDigitString } from '../../utils/helper'
import {
  arePriceSettingsIdentical,
  getDiscountedPrice,
  getOriginalPrice,
  getPriceSetting,
} from './helpers/filterVariant'
import ChildCheckboxHost from 'components/checkboxes/ChildCheckboxHost'

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
  setDiscount,
}) {
  const [checkbox, handleCheckboxChange] = useChildCheckbox(
    checkedFromProduct,
    setCheckboxFromProduct,
    setCheckboxFromSection,
    fromSection
  )

  const [originalPriceSetting, setOriginalPriceSetting] = useState(() =>
    getPriceSetting(variant)
  )

  const [priceSetting, setPriceSetting] = usePriceSetting(
    isSelectedOnly,
    checkbox.checked,
    discountFromProduct,
    variant
  )

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

  const handleVariantCheckboxChange = () => {
    setDiscount(current => ({
      ...current,
      status: KEEP_VALUE,
    }))
  }

  // Check if original setting changes when variant changes
  useEffect(() => {
    if (!arePriceSettingsIdentical(originalPriceSetting, variant)) {
      console.log('not identical')
      setOriginalPriceSetting(getPriceSetting(variant))
    }
  }, [originalPriceSetting, variant])

  // Responde to the reset from product
  useEffect(() => {
    if (reset.current !== resetFromProduct) {
      console.log('reset from product')
      reset.current = resetFromProduct
      setPriceSetting(originalPriceSetting)
    }
  }, [originalPriceSetting, resetFromProduct, setPriceSetting])

  return (
    <div className="variant--wrapper">
      <div className="variant--title">
        {/* Variant checkbox */}
        <ChildCheckboxHost
          id={`${idGroups.variant}--${idRoles.handler}-${variant.id}`}
          label={`${product.title} - ${variant.title}`}
          checked={checkbox.checked}
          onChange={handleVariantCheckboxChange}
          handleCheckboxChange={handleCheckboxChange}
        />

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

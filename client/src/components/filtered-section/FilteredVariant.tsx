import { FormEvent, useEffect, useState } from 'react'
import { useChildCheckbox } from '../../custom-hooks/useChildCheckbox'
import usePriceSetting from '../../custom-hooks/usePriceSetting'
import { getVariantById } from '../../utils/api'
import { idGroups, idRoles } from '../../utils/config'
import { createTwoDigitString } from '../../utils/helper'
import {
  arePriceSettingsIdentical,
  getDiscountedPrice,
  getOriginalPrice,
  getPriceSetting,
} from './helpers/filterVariant.helper'
import ChildCheckboxHost from 'components/checkboxes/ChildCheckboxHost'
import { FilteredVariantProps } from './types'
import { Blank, DiscountStatus, PriceSettingState } from 'custom-hooks/types'
import ResetButton from './ResetButton'
import PercentageInput from './PercentageInput'

export default function FilteredVariant({
  product,
  variant,
  checkedFromProduct,
  fromSection,
  setCheckboxFromProduct,
  setCheckboxFromSection,
  discountFromProduct,
  resetFromSection,
  resetFromProduct,
  isSelectedOnly,
  setDiscount,
}: FilteredVariantProps) {
  const [checkbox, handleCheckboxChange] = useChildCheckbox(
    checkedFromProduct,
    setCheckboxFromProduct,
    setCheckboxFromSection,
    fromSection
  )

  const [originalPriceSetting, setOriginalPriceSetting] =
    useState<PriceSettingState>(() => getPriceSetting(variant))

  const [priceSetting, setPriceSetting] = usePriceSetting(
    isSelectedOnly,
    checkbox.checked,
    discountFromProduct,
    variant
  )

  const modifyDiscount = (e: FormEvent<HTMLInputElement>) => {
    const { price, cap } = originalPriceSetting

    const originalPrice = getOriginalPrice(price, cap)
    const discountNumber = Number(e.currentTarget.value)

    setPriceSetting({
      price: discountNumber
        ? getDiscountedPrice(discountNumber, originalPrice)
        : originalPrice,
      cap: discountNumber ? originalPrice : Blank.blank_string,
      discount:
        e.currentTarget.value === Blank.blank_string
          ? e.currentTarget.value
          : discountNumber,
    })
  }

  const handleGetVariant =
    (variantId: number) => async (e: FormEvent<HTMLButtonElement>) => {
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
      status: DiscountStatus.KEEP_VALUE,
    }))
  }

  // Check if original setting changes when variant changes
  useEffect(() => {
    if (!arePriceSettingsIdentical(originalPriceSetting, variant)) {
      console.log('not identical')
      setOriginalPriceSetting(getPriceSetting(variant))
    }
  }, [originalPriceSetting, variant])

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
        <PercentageInput
          id={`${idGroups.variant}--${idRoles.discount}-${variant.id}`}
          discountValue={priceSetting.discount}
          handleDiscountChange={modifyDiscount}
        />

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

        <ResetButton
          resetFromProduct={resetFromProduct}
          resetFromSection={resetFromSection}
          originalPriceSetting={originalPriceSetting}
          setPriceSetting={setPriceSetting}
        >
          RESET PRICE SETTING
        </ResetButton>
      </div>
    </div>
  )
}

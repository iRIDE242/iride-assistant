import { useEffect, useState } from 'react'

const updateUpperCheckbox = (checked, max, setUpperCheckbox) => {
  if (max !== null) {
    if (checked) {
      if (setUpperCheckbox !== undefined)
        setUpperCheckbox(prev => {
          const currentSelected = prev.selected + 1

          if (currentSelected >= prev.max) {
            return {
              ...prev,
              checked: true,
              selected: prev.max,
            }
          } else {
            return {
              ...prev,
              selected: currentSelected,
            }
          }
        })
    } else {
      if (setUpperCheckbox !== undefined)
        setUpperCheckbox(prev => {
          const currentSelected = prev.selected - 1

          if (currentSelected < 0) {
            return {
              ...prev,
              checked: false,
              selected: 0,
            }
          } else {
            return {
              ...prev,
              selected: currentSelected,
            }
          }
        })
    }
  }
}

export default function ChildCheckbox({
  id,
  label,
  checkedFromUpper,
  setUpperCheckbox,
}) {
  const [lowerCheckbox, setLowerCheckbox] = useState({
    checked: false,
    fromUpper: true,
  })

  const handleChange = () => {
    setLowerCheckbox(prev => ({
      checked: !prev.checked,
      fromUpper: false,
    }))
  }

  // Sync the state from upper checkbox
  useEffect(() => {
    console.log('toggle checked in lower from upper')
    setLowerCheckbox({
      checked: checkedFromUpper,
      fromUpper: true,
    })
  }, [checkedFromUpper])

  // Only responde to the checked change caused by the component handleChange,
  // but not checked change caused by the upper checkbox state sync.
  useEffect(() => {
    if (lowerCheckbox.checked) {
      if (!lowerCheckbox.fromUpper && setUpperCheckbox !== undefined) {
        setUpperCheckbox(prev => {
          const currentSelected = prev.selected + 1

          return {
            ...prev,
            checked: currentSelected >= prev.max ? true : prev.checked,
            selected: currentSelected >= prev.max ? prev.max : currentSelected,
          }
        })
      }
    } else {
      if (!lowerCheckbox.fromUpper && setUpperCheckbox !== undefined)
        setUpperCheckbox(prev => {
          const currentSelected = prev.selected - 1

          return {
            ...prev,
            checked: currentSelected <= 0 ? false : prev.checked,
            selected: currentSelected <= 0 ? 0 : currentSelected,
          }
        })
    }
  }, [lowerCheckbox.checked, lowerCheckbox.fromUpper, setUpperCheckbox])

  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={lowerCheckbox.checked}
        onChange={handleChange}
      />
      <label htmlFor={id}>{label}</label>
    </>
  )
}

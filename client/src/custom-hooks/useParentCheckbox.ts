import { useEffect, useState } from 'react'
import { ParentCheckboxState } from 'components/filtered-section/types'

// So far only used in FilteredProduct to make the component tidy
export default function useParentCheckbox(
  initialCheckboxState: ParentCheckboxState | (() => ParentCheckboxState),
  checkedFromParent?: boolean
) {
  const [checkbox, setCheckbox] =
    useState<ParentCheckboxState>(initialCheckboxState)

  // Sync with parent checkbox if existing
  useEffect(() => {
    if (checkedFromParent !== undefined)
      setCheckbox(current => ({
        ...current,
        checked: checkedFromParent,
        selected: checkedFromParent ? current.max : 0,
        fromSection: true,
      }))
  }, [checkedFromParent])

  return [checkbox, setCheckbox] as const
}

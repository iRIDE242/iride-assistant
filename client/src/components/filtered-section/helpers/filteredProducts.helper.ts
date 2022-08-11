import { Variant } from 'components/types'
import { idGroups, idRoles } from 'utils/config'
import { ToggleVariantsActions } from '../types'

export const variantHandlerRegex = new RegExp(
  `${idGroups.variant}--${idRoles.handler}-(\\d+)` // Variant handler checkbox
)

export const productInputRegex = new RegExp(
  `${idGroups.filteredProducts}--${idRoles.product}-(\\d+)` // Product checkbox
)

export const replacer = (match: string, p1: string) => p1

export const bulkyVisuallyToggleVariants = (
  variantIds: Array<Variant['id']>,
  action: ToggleVariantsActions
) => {
  for (let index = 0; index < variantIds.length; index++) {
    const li = document.querySelector(
      `#variant-${variantIds[index]}`
    ) as HTMLLIElement
    action === ToggleVariantsActions.REMOVE
      ? (li.style.display = 'none')
      : (li.style.display = 'list-item')
  }
}

import { getVariantById, resetVariantWeightById } from "../utils/api"

export default function HiddenDetail({
  productsWithHidden,
  settings: {
    localStorageKey,
    background,
    mainColor,
    ignoredColor,
    detailTitle,
    mainTitle,
  },
}) {
  const handleSubmit = e => {
    e.preventDefault()

    const variantIds = []

    for (let index = 0; index < e.target.length; index++) {
      if (e.target[index].nodeName === 'INPUT' && e.target[index].checked)
        variantIds.push(e.target[index].id)
    }

    console.log(variantIds)
  }

  const handleGetVariant = (variantId) => async e => {
    e.preventDefault()
    console.log(variantId)
    const variant = await getVariantById(variantId)
    console.log(variant)
  }

  const handleResetWeight = variantId => async e => {
    e.preventDefault()
    const variant = await resetVariantWeightById(variantId)
    console.log(variant)
  }

  return (
    <div style={{ background: background }}>
      <h2>PRODUCTS WITH HIDDEN VARIANTS</h2>

      <div style={{ color: mainColor }}>
        <form onSubmit={handleSubmit}>
          {productsWithHidden.map(product => (
            <div key={product.id}>
              <h3>{product.title}</h3>
              <ul>
                {product.variants.map(
                  variant =>
                    variant.weight === 9999 && (
                      <li key={variant.id}>
                        <input type="checkbox" id={variant.id} />
                        <label
                          htmlFor={variant.id}
                        >{`${product.title} - ${variant.title}`}</label>
                        <button onClick={handleGetVariant(variant.id)}>GET VARIANT</button>
                        <button onClick={handleResetWeight(variant.id)}>RESET WEIGHT</button>
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
          <button type="submit">REMOVE HIDDEN STATUS</button>
        </form>
      </div>
    </div>
  )
}

import HiddenProduct from './HiddenProduct'

const regex = /^\d/

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
      if (
        e.target[index].nodeName === 'INPUT' &&
        e.target[index].checked &&
        regex.test(e.target[index].id)
      )
        variantIds.push(e.target[index].id)
    }

    console.log(variantIds)
  }

  return (
    <div style={{ background: background }}>
      <h2>PRODUCTS WITH HIDDEN VARIANTS</h2>

      <div style={{ color: mainColor }}>
        <form onSubmit={handleSubmit}>
          {productsWithHidden.map(product => (
            <HiddenProduct key={product.id} product={product} />
          ))}
          <button type="submit">REMOVE HIDDEN STATUS</button>
        </form>
      </div>
    </div>
  )
}

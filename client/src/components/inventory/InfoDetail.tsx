import { Product } from 'components/types'
import { LocalStorageKeys } from 'custom-hooks/types'
import { useRef, useState, Dispatch, SetStateAction, FormEvent } from 'react'
import useLocalStorageState from '../../custom-hooks/useLocalStorageState'
import ProductRow from './ProductRow'
import { From, Ignored, InfoDetailProps } from './types'

export default function InfoDetail({
  outOfStockProducts,
  settings: {
    localStorageKey,
    background,
    mainColor,
    ignoredColor,
    detailTitle,
    mainTitle,
  },
}: InfoDetailProps) {
  const [ignoredProductIds, setIgnoredProductIds] =
    useLocalStorageState<number>({
      key: localStorageKey,
      initialValue: [] as number[],
    }) as readonly [number[], Dispatch<SetStateAction<number[]>>]

  const [ignoredVendors, setIgnoredVendors] = useLocalStorageState<string>({
    key: LocalStorageKeys.IGNORED_VENDORS,
    initialValue: [] as string[],
  }) as readonly [string[], Dispatch<SetStateAction<string[]>>]

  const [isHidden, setIsHidden] = useState<boolean>(true)
  const [isModified, setIsModified] = useState<boolean>(false)
  const [vendorString, setVendorString] = useState<string>(() =>
    (ignoredVendors as string[]).join()
  )

  // Original vendor string
  const vendorStringRef = useRef<string>(vendorString)

  let notIgnored: Product[] = []
  let ignored: Ignored[] = []

  if (outOfStockProducts.length) {
    outOfStockProducts.forEach(product => {
      ignoredProductIds.indexOf(product.id) === -1
        ? localStorageKey === 'ignoredProductIds'
          ? ignoredVendors.indexOf(product.vendor) === -1
            ? notIgnored.push(product)
            : ignored.push({ product, from: From.VENDOR })
          : notIgnored.push(product)
        : ignored.push({ product, from: From.ITEM })
    })
  }

  const handleAddToIgnored =
    (setIgnored: Dispatch<SetStateAction<number[]>>) =>
    (ignoredProductId: number) => {
      setIgnored(prevIds => [...prevIds, ignoredProductId])
    }

  const handleRemoveFromIgnored =
    (setIgnored: Dispatch<SetStateAction<number[]>>) =>
    (notIgnoredProductId: number) => {
      setIgnored(prevIds => prevIds.filter(id => id !== notIgnoredProductId))
    }

  const toggleIgnored =
    (setToggle: Dispatch<SetStateAction<boolean>>) => () => {
      setToggle(prev => !prev)
    }

  const handleClearIgnored =
    (setIgnored: Dispatch<SetStateAction<number[]>>) => () => {
      setIgnored([])
    }

  const handleVendorSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    vendorStringRef.current = vendorString

    setIgnoredVendors(vendorString.split(',').map(str => str.trim()))
    setIsModified(false)
  }

  const handleVendorChange = (e: FormEvent<HTMLInputElement>) => {
    console.log(`event: ${e.currentTarget.value}`)
    console.log(`ref: ${vendorStringRef.current}`)
    e.currentTarget.value !== vendorStringRef.current
      ? setIsModified(true)
      : setIsModified(false)
    setVendorString(e.currentTarget.value)
  }

  return (
    <div style={{ background: background }}>
      <h2>{detailTitle}</h2>

      {localStorageKey === 'ignoredProductIds' && (
        <div>
          <form onSubmit={handleVendorSubmit}>
            <label htmlFor="ignored-vendors">
              Ignored vendors (case sensitive)
            </label>{' '}
            <input
              type="text"
              id="ignored-vendors"
              onChange={handleVendorChange}
              value={vendorString}
            />
            <button type="submit" disabled={!isModified}>
              SUBMIT
            </button>
          </form>
        </div>
      )}

      <div style={{ color: mainColor }}>
        <h3>
          {mainTitle} [Counts: {notIgnored.length}]
        </h3>
        {notIgnored.map(p => (
          <ProductRow
            key={p.id}
            product={p}
            fromInventory={true}
            notIgnored={true}
            handleAddToIgnored={handleAddToIgnored(setIgnoredProductIds)}
          />
        ))}
      </div>
      {ignored.length > 0 && (
        <>
          <button onClick={toggleIgnored(setIsHidden)}>
            {isHidden ? 'SHOW IGNORED' : 'HIDE IGNORED'}
          </button>
          <div
            style={{
              color: ignoredColor,
              display: isHidden ? 'none' : 'block',
            }}
          >
            <h3>Ignored [Counts: {ignored.length}]</h3>
            {ignored.map(({ product, from }) => (
              <ProductRow
                key={product.id}
                product={product}
                fromInventory={true}
                isIgnored={true}
                handleRemoveFromIgnored={handleRemoveFromIgnored(
                  setIgnoredProductIds
                )}
                from={from}
              />
            ))}
            <div>
              <button onClick={handleClearIgnored(setIgnoredProductIds)}>
                CLEAR ALL ITEMS IN THE IGNORED LIST [COUNTS: {ignored.length}]
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

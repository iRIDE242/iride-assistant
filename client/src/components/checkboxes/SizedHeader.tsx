import { HeaderSizes, SizedHeaderProps } from "./types"

export default function SizedHeader({ headerSize, children }: SizedHeaderProps) {
  const style = {
    display: 'inline-block',
  }

  return (
    <>
      {headerSize === HeaderSizes.H2 && <h2 style={style}>{children}</h2>}
      {headerSize === HeaderSizes.H3 && <h3 style={style}>{children}</h3>}
      {!headerSize && <p style={style}>{children}</p>}
    </>
  )
}
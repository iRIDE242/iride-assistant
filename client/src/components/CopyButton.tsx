import { FormEvent } from 'react'
import { CopyButtonProps } from './types'

export default function CopyButton({
  title,
  showCopy = true,
  setIsCopied,
}: CopyButtonProps) {
  const handleClick = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsCopied(true)
    navigator.clipboard.writeText(title)
  }

  return <>{showCopy && <button onClick={handleClick}>COPY</button>}</>
}

export default function CopyButton({ title, showCopy = true, setIsCopied } = {}) {
  const handleClick = e => {
    e.preventDefault()
    setIsCopied(true)
    navigator.clipboard.writeText(title)
  }

  return <>{showCopy && <button onClick={handleClick}>COPY</button>}</>
}

export default function CopyButton({ title, showCopy, setIsCopied }) {
  const handleClick = e => {
    e.preventDefault()
    setIsCopied(true)
    navigator.clipboard.writeText(title)
  }

  return <>{showCopy && <button onClick={handleClick}>COPY</button>}</>
}

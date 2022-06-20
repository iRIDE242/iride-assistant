export default function CopyHint({ isCopied }) {
  return (
    <p
      style={{
        color: 'green',
        flex: 1,
        textAlign: 'left',
        marginLeft: '16px',
      }}
    >
      {isCopied ? 'Title has been copied.' : ''}
    </p>
  )
}

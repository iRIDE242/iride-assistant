import { CopyHintProps } from './types'

export default function CopyHint({ isCopied }: CopyHintProps) {
  return (
    <p
      style={{
        color: 'green',
        flex: 1,
        textAlign: 'left',
        marginLeft: '16px',
        display: 'inline-block',
      }}
    >
      {isCopied ? 'Title has been copied.' : ''}
    </p>
  )
}

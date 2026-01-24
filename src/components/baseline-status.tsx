import type { JSX } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'baseline-status': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { featureId: string }
    }
  }
}

interface Props {
  id: string
}

export function BaselineStatus({ id }: Props): JSX.Element {
  return <baseline-status featureId={id} />
}

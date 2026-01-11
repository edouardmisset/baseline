declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      'baseline-status': { featureId: string } & JSX.HTMLAttributes<HTMLElement>
    }
  }
}

interface Props {
  id: string
}

export function BaselineStatus({ id }: Props) {
  return <baseline-status featureId={id}></baseline-status>
}

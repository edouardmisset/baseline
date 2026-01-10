import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'baseline-status': { featureId: string };
    }
  }
}

interface Props {
  id: string;
}

export default function BaselineStatus({ id }: Props) {
  return (
    <baseline-status featureId={id}></baseline-status>
  );
}

import { render } from 'preact';
import './style.css';
import FeatureDashboard from './components/FeatureDashboard';

const WEB_FEATURES = [
  'temporal',
  'view-transitions',
  'popover',
  'dialog',
  'grid',
  'flexbox',
  'subgrid',
  'container-queries',
  'css-nesting',
  'has',
  'css-cascade-layers',
  'css-scoping',
  'anchor-positioning',
  'scroll-driven-animations',
  'web-gpu'
];

export function App() {
	return (
		<div>
      <h1 style={{textAlign: 'center', marginBottom: '40px'}}>Web Features Dashboard</h1>
      <FeatureDashboard featureIds={WEB_FEATURES} />
    </div>
	);
}

render(<App />, document.getElementById('app'));

import './index.scss';

import { RightsizingPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new RightsizingPlugin();
}
// export { RightsizingPluginSetup, RightsizingPluginStart } from './types';

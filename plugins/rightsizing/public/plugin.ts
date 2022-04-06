import { i18n } from '@osd/i18n';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { SharePluginStart } from '../../../src/plugins/share/public';
import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';
import { PLUGIN_NAME } from '../common';

interface StartDeps {
  share: SharePluginStart;
  navigation: NavigationPublicPluginStart;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SetupDeps {}

export class RightsizingPlugin implements Plugin<void, void, SetupDeps, StartDeps> {
  public setup(core: CoreSetup<StartDeps>) {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'rightsizing',
      title: PLUGIN_NAME,
      category: {
        id: 'rightsizing',
        label: 'Rightsizing Plugins',
        order: 2000,
      },
      async mount(params: AppMountParameters) {
        // Load application bundle
        // Get start services as specified in opensearch_dashboards.json
        const [coreStart, depsStart] = await core.getStartServices();
        const { renderApp } = await import('./app');
        // Render the application
        return renderApp(
          coreStart,
          {
            getLinkGenerator: depsStart.share.urlGenerators.getUrlGenerator,
            navigation: depsStart.navigation,
          },
          params
        );
      },
    });
  }

  public start() {}

  public stop() {}
}

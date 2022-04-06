import { i18n } from '@osd/i18n';
import { SharePluginStart, SharePluginSetup } from '../../../src/plugins/share/public';
import { AppMountParameters, CoreSetup, AppNavLinkStatus, Plugin } from '../../../src/core/public';
import {
  PodDetailLinkGeneratorState,
  createPodDetailPageLinkGenerator,
  createApiServerLinkGenerator,
  RIGHTSIZING_POD_URL_GENERATOR,
} from './url_generator';
import { PLUGIN_NAME } from '../common';

declare module '../../../src/plugins/share/public' {
  export interface UrlGeneratorStateMapping {
    [RIGHTSIZING_POD_URL_GENERATOR]: PodDetailLinkGeneratorState;
  }
}

interface StartDeps {
  share: SharePluginStart;
}

interface SetupDeps {
  share: SharePluginSetup;
}

const APP_ID = 'rightsizingDetail';

export class AccessRightsizingPodDetailPlugin implements Plugin<void, void, SetupDeps, StartDeps> {
  public setup(core: CoreSetup<StartDeps>, { share: { urlGenerators } }: SetupDeps) {
    urlGenerators.registerUrlGenerator(
      createPodDetailPageLinkGenerator(async () => ({
        appBasePath: (await core.getStartServices())[0].application.getUrlForApp(APP_ID),
      }))
    );
    urlGenerators.registerUrlGenerator(
      createApiServerLinkGenerator(async () => ({
        appBasePath: (await core.getStartServices())[0].application.getUrlForApp(APP_ID),
      }))
    );

    core.application.register({
      id: APP_ID,
      title: PLUGIN_NAME,
      navLinkStatus: AppNavLinkStatus.hidden,
      // category: {
      //   id: 'rightsizing',
      //   label: 'Rightsizing Plugins',
      //   order: 2000,
      // },
      async mount(params: AppMountParameters) {
        const { renderApp } = await import('./app');
        return renderApp(
          {
            appBasePath: params.appBasePath,
          },
          params
        );
      },
    });
  }

  public start() {}

  public stop() {}
}

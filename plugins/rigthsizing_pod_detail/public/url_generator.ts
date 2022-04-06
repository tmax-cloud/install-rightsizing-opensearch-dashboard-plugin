import url from 'url';
import { UrlGeneratorState, UrlGeneratorsDefinition } from '../../../src/plugins/share/public';

import { ROUTE_PATH } from '../common';

export const RIGHTSIZING_POD_URL_GENERATOR = 'RIGHTSIZING_POD_URL_GENERATOR_V2';

export const RIGHTSIZING_API_SERVER_GENERATOR = 'RIGHTSIZING_API_SERVER_URL_GENERATOR';

export interface PodDetailPageLinkState {
  namespace: string;
  name: string;
}

export type PodDetailLinkGeneratorState = UrlGeneratorState<PodDetailPageLinkState>;

export const createPodDetailPageLinkGenerator = (
  getStartServices: () => Promise<{ appBasePath: string }>
): UrlGeneratorsDefinition<typeof RIGHTSIZING_POD_URL_GENERATOR> => ({
  id: RIGHTSIZING_POD_URL_GENERATOR,
  createUrl: async (state) => {
    const startServices = await getStartServices();
    const appBasePath = startServices.appBasePath;
    const parsedUrl = url.parse(window.location.href);

    return url.format({
      protocol: parsedUrl.protocol,
      host: parsedUrl.host,
      pathname: `${appBasePath}/${ROUTE_PATH}`,
      query: {
        ...state,
      },
    });
  },
});

export const createApiServerLinkGenerator = (
  getStartServices: () => Promise<{ appBasePath: string }>
): UrlGeneratorsDefinition<typeof RIGHTSIZING_API_SERVER_GENERATOR> => ({
  id: RIGHTSIZING_API_SERVER_GENERATOR,
  createUrl: async (state) => {
    const startServices = await getStartServices();
    const appBasePath = startServices.appBasePath;
    const parsedUrl = url.parse(window.location.href);

    return url.format({
      protocol: parsedUrl.protocol,
      host: parsedUrl.host,
      pathname: '',
      query: {
        ...state,
      },
    });
  },
});

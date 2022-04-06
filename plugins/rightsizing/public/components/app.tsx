import React, { useState, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiSpacer,
  EuiLoadingSpinner,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import { UrlGeneratorsService } from '../../../../src/plugins/share/public';

import {
  RIGHTSIZING_API_SERVER_GENERATOR,
  RIGHTSIZING_POD_URL_GENERATOR,
} from '../../../rigthsizing_pod_detail/public/url_generator';
import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import { ClusterInfo, PodListTable } from './clusterinfo';

interface RightsizingAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  getLinkGenerator: UrlGeneratorsService['getUrlGenerator'];
}

export const RightsizingApp = ({
  basename,
  notifications,
  http,
  navigation,
  getLinkGenerator,
}: RightsizingAppDeps) => {
  const [clusterInfo, setClusterInfo] = useState(null);
  const [pods, setPods] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const generateLink = async (podList, apiServerUrl) => {
    const updatedPods = await Promise.all(
      podList.map(async (pod) => {
        const generator = getLinkGenerator(RIGHTSIZING_POD_URL_GENERATOR);
        const link = await generator.createUrl({
          api_server_url: `${apiServerUrl}`,
          namespace: pod.namespace,
          name: pod.name,
        });
        return {
          ...pod,
          link: {
            isDeprecated: generator.isDeprecated,
            linkText: pod.name,
            link,
          },
        };
      })
    );
    setPods(updatedPods);
    setIsLoading(false);
  };

  const fetchClusterInfo = async (apiServerUrl: string) => {
    axios.get(`${apiServerUrl}/api/v1/pods/clusterinfo`).then((data: AxiosResponse) => {
      if (data.status === 200) {
        setClusterInfo(data.data);
      }
    });

    axios
      .get(`${apiServerUrl}/api/v1/pods`)
      .then((data: AxiosResponse) => {
        if (data.status === 200) {
          return data.data;
        }
        return null;
      })
      .then((res) => {
        if (res !== null) {
          generateLink(res, apiServerUrl).catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  };

  const getApiServerUrl = async () => {
    const generator = getLinkGenerator(RIGHTSIZING_API_SERVER_GENERATOR);
    const url = await generator.createUrl({});
    const protocol = url.split('/')[0];
    const splitUrl = url.split('.');
    const serverUrl = protocol + '//rightsizing.' + splitUrl.slice(1, splitUrl.length).join('.');
    // const serverUrl = 'http://127.0.0.1:8000';
    return serverUrl;
  };

  useEffect(() => {
    getApiServerUrl().then((url: string) => fetchClusterInfo(url));
  }, []);

  if (isLoading) {
    return (
      <Router basename={basename}>
        <I18nProvider>
          <>
            <EuiPage>
              <EuiPageBody>
                <EuiPageContent>
                  <EuiPageContentBody>
                    <EuiLoadingSpinner size="xl" />
                  </EuiPageContentBody>
                </EuiPageContent>
              </EuiPageBody>
            </EuiPage>
          </>
        </I18nProvider>
      </Router>
    );
  } else {
    // Render the application DOM.
    // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
    return (
      <Router basename={basename}>
        <I18nProvider>
          <>
            <EuiPage>
              <EuiPageBody>
                <EuiPageContent>
                  <EuiPageContentBody>
                    {/* <EuiFlexGroup gutterSize="l">
                      <EuiPanel paddingSize="l" style={{ width: '40%' }}>
                        <ExampleInfo pods={pods} />
                      </EuiPanel>
                      <EuiPanel paddingSize="l" style={{ width: '60%' }}>
                        <ExampleChart />
                      </EuiPanel>
                    </EuiFlexGroup> */}
                    {clusterInfo === null ? undefined : <ClusterInfo clusterInfo={clusterInfo} />}
                    <EuiSpacer size="xxl" />
                    <EuiSpacer size="xxl" />

                    {pods === null ? undefined : <PodListTable pods={pods} />}
                  </EuiPageContentBody>
                </EuiPageContent>
              </EuiPageBody>
            </EuiPage>
          </>
        </I18nProvider>
      </Router>
    );
  }
};

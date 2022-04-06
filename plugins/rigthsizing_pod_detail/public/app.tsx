import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios, { AxiosResponse } from 'axios';

import { Route, Switch, Redirect, Router, useLocation } from 'react-router-dom';
import {
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiLoadingSpinner,
  EuiBadge,
  EuiBreadcrumbs,
  EuiHorizontalRule,
  EuiPage,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { createBrowserHistory } from 'history';
import { AppMountParameters } from '../../../src/core/public';

import { ROUTE_PATH } from '../common';
import { DetailedView } from './components/detailed_pod';

function useQuery() {
  const { search } = useLocation();
  const params = React.useMemo(() => new URLSearchParams(search), [search]);
  return params;
}

interface PodDetailPageProps {
  apiServerUrl: string;
  namespace: string;
  name: string;
}

const PATH = `/${ROUTE_PATH}`;

const Badges = [
  <EuiBadge color="#42ba96"> Optimized </EuiBadge>,
  <EuiBadge color="#df4759"> UnderAllocated </EuiBadge>,
  <EuiBadge color="#ffc107"> OverAllocated </EuiBadge>,
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PodDetailPage = ({ apiServerUrl, namespace, name }: PodDetailPageProps) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const badge = Badges[0];

  const breadcrumbs = [
    {
      text: 'rightsizing',
    },
    {
      text: namespace,
    },
    {
      text: name,
    },
  ];

  const getData = async () => {
    axios
      .get(`${apiServerUrl}/api/v1/pods?namespace=${namespace}&name=${name}`)
      .then((result: AxiosResponse) => {
        if (result.status === 200) {
          setData(result.data);
          setIsLoading(false);
        }
      })
      .catch((error) => console.log(error));
    // await delay(3000);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
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
    );
  }

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <>
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent>
            <EuiBreadcrumbs
              breadcrumbs={breadcrumbs}
              truncate={true}
              aria-label="Rightsizing information"
            />
            <EuiPageContentBody>
              <EuiSpacer size="m" />

              <EuiTitle>
                <h2>{name}</h2>
                {/* <h2>
                  {name} {badge}
                </h2> */}
              </EuiTitle>

              <EuiHorizontalRule margin="none" />

              <EuiSpacer size="m" />

              <DetailedView data={data} />
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
};

export const Routes: React.FC<{}> = () => {
  const query = useQuery();
  const namespace = query.get('namespace') || '';
  const name = query.get('name') || '';
  const apiServerUrl = query.get('api_server_url') || '';

  return (
    <Switch>
      <Route path={PATH}>
        {namespace !== '' && name !== '' ? (
          <PodDetailPage apiServerUrl={apiServerUrl} namespace={namespace} name={name} />
        ) : undefined}
      </Route>
      <Redirect from="/" to={`/${ROUTE_PATH}`} />
    </Switch>
  );
};

export const LinksExample: React.FC<{
  appBasePath: string;
}> = (props) => {
  const history = React.useMemo(
    () =>
      createBrowserHistory({
        basename: props.appBasePath,
      }),
    [props.appBasePath]
  );
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
};

export const renderApp = (props: { appBasePath: string }, { element }: AppMountParameters) => {
  ReactDOM.render(<LinksExample {...props} />, element);

  return () => ReactDOM.unmountComponentAtNode(element);
};

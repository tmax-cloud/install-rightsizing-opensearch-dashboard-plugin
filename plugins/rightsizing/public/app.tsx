import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';
import { UrlGeneratorsService } from '../../../src/plugins/share/public';
import { RightsizingApp } from './components/app';

interface Props {
  getLinkGenerator: UrlGeneratorsService['getUrlGenerator'];
  navigation: NavigationPublicPluginStart;
}

export const renderApp = (
  { notifications, http }: CoreStart,
  props: Props,
  { appBasePath, element }: AppMountParameters
) => {  
  ReactDOM.render(
    <RightsizingApp
      basename={appBasePath}
      notifications={notifications}
      http={http}
      navigation={props.navigation}
      getLinkGenerator={props.getLinkGenerator}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};

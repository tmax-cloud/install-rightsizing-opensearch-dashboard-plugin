import React from 'react';
import { EuiFlexGroup, EuiPanel } from '@elastic/eui';

import { ResourceChart } from './chart';
import { ResourceDash } from './dash';

export const ClusterInfo = (props) => {
  const clusterInfo = props.clusterInfo;
  const cpuInfo = clusterInfo.cpu;
  const memoryInfo = clusterInfo.memory;

  return (
    <EuiFlexGroup gutterSize="l">
      <EuiPanel paddingSize="l" style={{ width: '40%' }}>
        <ResourceDash cpuInfo={cpuInfo} memoryInfo={memoryInfo} />
      </EuiPanel>
      <EuiPanel paddingSize="l" style={{ width: '60%' }}>
        <ResourceChart cpuInfo={cpuInfo} memoryInfo={memoryInfo} />
      </EuiPanel>
    </EuiFlexGroup>
  );
};

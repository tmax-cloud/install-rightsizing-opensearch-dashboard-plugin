import React from 'react';
import {
  EuiFlexGrid,
  EuiFlexItem,
  EuiTitle,
  EuiSpacer,
  htmlIdGenerator,
  EuiTextAlign,
  EuiText,
  EuiFlexGroup,
  EuiPanel,
  EuiHorizontalRule,
  EuiStat,
} from '@elastic/eui';
import { formatBytes } from '../../../common';

export const ResourceDash = (props) => {
  const cpuInfo = props.cpuInfo;
  const memoryInfo = props.memoryInfo;

  const titleSize = 'm';

  return (
    <>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiText>
            <h2>Cluster Overall</h2>
          </EuiText>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiPanel color="transparent">
            <EuiTitle size={titleSize}>
              <h2>CPU</h2>
            </EuiTitle>

            <EuiSpacer size="m" />

            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiStat
                  title={`${cpuInfo.average.toFixed(2)} Cores`}
                  description="Average Usage"
                  titleColor="subdued"
                  titleSize={titleSize}
                />
                {/* <EuiText>
                  <p>
                    Average <br />
                    <font size="5"> 0.52 Cores </font><br />
                    Usage
                  </p>
                </EuiText> */}
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiStat
                  title={`${cpuInfo.overallocated} Pods`}
                  description="OverProvisioned"
                  titleColor="primary"
                  titleSize={titleSize}
                />
                {/* <EuiText>
                  <p>
                    Overcommited<br />
                    <font size="5"> 142 Vms </font><br />
                    Usage
                  </p>
                </EuiText> */}
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiStat
                  title={`${cpuInfo.underallocated} Pods`}
                  description="UnderProvisioned"
                  titleColor="accent"
                  titleSize={titleSize}
                />
                {/* <EuiText>
                  <p>
                    Undercommited<br />
                    <font size="5"> 0.52 Vms </font><br />
                    Usage
                  </p>
                </EuiText> */}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>

          <EuiSpacer />

          <EuiPanel color="transparent">
            <EuiTitle size={titleSize}>
              <h2>Memory</h2>
            </EuiTitle>

            <EuiSpacer size="m" />

            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiStat
                  title={formatBytes(memoryInfo.average)}
                  description="Average Usage"
                  titleColor="subdued"
                  titleSize={titleSize}
                />
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiStat
                  title={`${memoryInfo.overallocated} Pods`}
                  description="OverProvisioned"
                  titleColor="primary"
                  titleSize={titleSize}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiStat
                  title={`${memoryInfo.underallocated} Pods`}
                  description="UnderProvisioned"
                  titleColor="accent"
                  titleSize={titleSize}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

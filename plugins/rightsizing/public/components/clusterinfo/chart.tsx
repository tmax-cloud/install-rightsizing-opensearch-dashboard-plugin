import React, { Component } from 'react';
import {
  EuiFlexGroup,
  EuiFlexGrid,
  EuiFlexItem,
  EuiTitle,
  EuiSpacer,
  htmlIdGenerator,
  EuiTextAlign,
  EuiText,
  EuiPanel,
} from '@elastic/eui';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';

const colors = ['#f44336', '#82ca9d', '#ff9966'];

const ClusterPieChart = ({ data }) => {
  return (
    <PieChart width={400} height={280}>
      <Pie data={data} cx="50%" cy="50%" dataKey="value" nameKey="name" outerRadius={80}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend wrapperStyle={{ fontSize: '12px' }} width={400} />
    </PieChart>
  );
};

export const ResourceChart = (props) => {
  const cpuInfo = props.cpuInfo;
  const memoryInfo = props.memoryInfo;
  const cpuChartId = htmlIdGenerator();
  const memoryChartId = htmlIdGenerator();
  const euiChartTheme = EUI_CHARTS_THEME_LIGHT;

  const cpuData = [
    {
      name: 'Under Provisioned',
      value: cpuInfo.underallocated,
    },
    {
      name: 'Optimized',
      value: cpuInfo.optimized,
    },
    {
      name: 'Over Provisioned',
      value: cpuInfo.overallocated,
    },
  ];
  const memoryData = [
    {
      name: 'Under Provisioned',
      value: memoryInfo.underallocated,
    },
    {
      name: 'Optimized',
      value: memoryInfo.optimized,
    },
    {
      name: 'Over Provisioned',
      value: memoryInfo.overallocated,
    },
  ];

  return (
    <div>
      <EuiText>
        <EuiTextAlign textAlign="left">
          <h2> 클러스터 리소스 사용량 </h2>
        </EuiTextAlign>
      </EuiText>

      <EuiSpacer size="m" />

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiFlexGroup direction="column" alignItems="center" gutterSize="none">
            <EuiFlexItem>
              <EuiTitle className="eui-textCenter" size="xs">
                <h3>CPU 할당량 비율</h3>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem>
              <ResponsiveContainer width="100%" height="100%">
                <ClusterPieChart data={cpuData} />
              </ResponsiveContainer>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup direction="column" alignItems="center" gutterSize="none">
            <EuiFlexItem>
              <EuiTitle className="eui-textCenter" size="xs">
                <h3>메모리 사용량 비율</h3>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem>
              <ResponsiveContainer width="100%" height="100%">
                <ClusterPieChart data={memoryData} />
              </ResponsiveContainer>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};

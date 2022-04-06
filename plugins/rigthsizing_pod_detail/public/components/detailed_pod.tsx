import React, { useState, useRef, useEffect } from 'react';
import {
  Axis,
  Chart,
  LineSeries,
  niceTimeFormatByDay,
  RectAnnotation,
  LineSeriesStyle,
  RecursivePartial,
  ScaleType,
  Settings,
  timeFormatter,
  AreaSeries,
} from '@elastic/charts';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiBasicTable,
  EuiHealth,
  EuiHorizontalRule,
  EuiSwitch,
} from '@elastic/eui';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { formatBytes } from '../../common';

const stroke = ['#8884d8', '#82ca9d', '#ff7c43', '#64ad73', '#ffc658', '#f1f1f1'];

const ContainerLineChart = ({ names, data, isMemory }) => {
  return (
    <LineChart
      width={800}
      height={350}
      data={data}
      margin={{
        top: 0,
        right: 10,
        left: 10,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis tick={{ fontSize: 12 }} dataKey="time" />
      {isMemory === true ? (
        <YAxis tick={{ fontSize: 12 }} tickFormatter={formatBytes} width={100} />
      ) : (
        <YAxis tick={{ fontSize: 12 }} />
      )}
      <Tooltip />
      <Legend verticalAlign={'top'} align={'center'} height={25} />
      {names.map((name: string, index) => (
        <Line
          type="monotone"
          dataKey={name}
          stroke={stroke[index]}
          dot={false}
          activeDot={{ r: 5 }}
        />
      ))}
    </LineChart>
  );
};

const ContainerStackedLineChart = ({ names, data, isMemory }) => {
  return (
    <AreaChart
      width={800}
      height={350}
      data={data}
      margin={{
        top: 0,
        right: 10,
        left: 10,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis tick={{ fontSize: 12 }} dataKey="time" />
      {isMemory === true ? (
        <YAxis tick={{ fontSize: 12 }} tickSize={10} tickFormatter={formatBytes} />
      ) : (
        <YAxis tick={{ fontSize: 12 }} />
      )}
      <Tooltip />
      <Legend verticalAlign={'top'} align={'center'} height={25} />
      {names.map((name: string, index) => (
        <Area
          type="monotone"
          dataKey={name}
          stackId="1"
          stroke={stroke[index]}
          fill={stroke[index]}
        />
      ))}
    </AreaChart>
  );
};

const ResourceChart = ({ title, names, data }) => {
  const [stacked, setStacked] = useState(false);

  const onStackChange = (e) => {
    setStacked(e.target.checked);
  };

  return (
    <>
      <EuiFlexGroup direction="column" gutterSize="none">
        <EuiFlexGroup justifyContent="spaceBetween" gutterSize="none">
          <EuiFlexItem grow={false}>
            <EuiTitle size="xs">
              <h3> {title} </h3>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiSwitch label="stacked" checked={stacked} onChange={(e) => onStackChange(e)} />
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />

        <EuiFlexItem>
          <ResponsiveContainer width="100%" height="100%">
            {stacked === true ? (
              <ContainerStackedLineChart names={names} data={data} isMemory={title === 'Memory'} />
            ) : (
              <ContainerLineChart names={names} data={data} isMemory={title === 'Memory'} />
            )}
          </ResponsiveContainer>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export const ContainerTable = ({ data }) => {
  const columns = [
    {
      field: 'name',
      name: 'Container',
      truncateText: true,
    },
    {
      field: 'cpuAllocated',
      name: 'CPU Allocated',
      render: (value) => {
        if (value !== undefined) {
          return value.toFixed(2);
        }
        return undefined;
      },
    },
    {
      field: 'cpuUsage',
      name: 'CPU Usage',
      render: (value) => {
        if (value !== undefined) {
          return value.toFixed(2);
        }
        return undefined;
      },
    },
    {
      field: 'cpuOptimized',
      name: 'Recommendation CPU',
      render: (value) => {
        if (value !== undefined) {
          return value.toFixed(2);
        }
        return undefined;
      },
    },
    {
      field: 'memoryAllocated',
      name: 'Memory Allocated',
      render: (value) => {
        if (value !== undefined) {
          return formatBytes(value);
        }
        return undefined;
      },
    },
    {
      field: 'memoryUsage',
      name: 'Memory Usage',
      render: (value) => {
        if (value !== undefined) {
          return formatBytes(value);
        }
        return undefined;
      },
    },
    {
      field: 'memoryOptimized',
      name: 'Recommendation Memory',
      render: (value) => {
        if (value !== undefined) {
          return formatBytes(value);
        }
        return undefined;
      },
    },
    {
      field: 'status',
      name: 'status',
      render: (status) => {
        return <EuiHealth color={status} />;
      },
      align: 'center',
    },
  ];

  return (
    <div>
      <EuiBasicTable
        tableCaption="Per container rightsizing result"
        items={data}
        columns={columns}
      />
    </div>
  );
};

/*
  resourcePerTimeData = {
    cpu: {
      '시간': {
        container_name: value,
        ...
      }
    },
    memory: {

    }
  }
*/
export const DetailedView = ({ data }) => {
  const resourcePerTimeData = { cpu: {}, memory: {} };
  const containerData = [];
  const containerNames = [];

  data.containers.forEach((container) => {
    const containerName = container.container_name;
    const status = container.status; // success, danger, subdued

    containerNames.push(containerName);

    const containerUsage = { name: containerName };
    Object.entries(container.usages).forEach(([resourceName, resource]) => {
      containerUsage[`${resourceName}Usage`] = resource.current_usage;
      containerUsage[`${resourceName}Allocated`] = resource.limit;
      containerUsage[`${resourceName}Optimized`] = resource.optimized_usage;
      if (resource.usage !== undefined) {
        const points = resource.usage.map((point) => {
          return {
            time: new Date(point.Time * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            value: point.Value,
          };
        });
        points.forEach((point) => {
          if (resourcePerTimeData[resourceName].hasOwnProperty(point.time) !== true) {
            resourcePerTimeData[resourceName][point.time] = {};
          }
          resourcePerTimeData[resourceName][point.time][containerName] = point.value;
        });
      }
    });
    containerUsage.status = status;
    containerData.push(containerUsage);
  });

  const chartData = {};
  Object.entries(resourcePerTimeData).map(([resource, data]) => {
    chartData[resource] = Object.entries(data).map(([time, point]) => {
      return { time, ...point };
    });
  });

  console.log(chartData, chartData['cpu'], chartData['memory']);

  return (
    <>
      <EuiTitle size="s">
        <h2> 리소스 사용량 </h2>
      </EuiTitle>

      <EuiSpacer size="m" />

      <EuiFlexGroup>
        <EuiFlexGroup gutterSize="m" justifyContent="spaceAround">
          <EuiFlexItem>
            <EuiPanel paddingSize="l">
              <ResourceChart title={'CPU'} names={containerNames} data={chartData['cpu']} />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="l">
              <ResourceChart title={'Memory'} names={containerNames} data={chartData['memory']} />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexGroup>

      <EuiSpacer size="m" />

      <EuiHorizontalRule />

      <EuiTitle size="s">
        <h2> 컨테이너 별 리소스 사용량 </h2>
      </EuiTitle>

      <EuiSpacer size="xs" />

      <ContainerTable data={containerData} />
    </>
  );
};

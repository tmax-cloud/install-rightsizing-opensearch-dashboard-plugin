import { CoreStart } from '../../../src/core/public';

export const fetchClusterInfo = async (http: CoreStart['http'], url: string) => {
  http.get(url).then((res) => {
    const clusterResourceInfo = res.map((pod) => {
      const namespace = pod.namespace;
      const name = pod.name;
      const currentUsages = {};
      const totalLimits = {};
      const totalRequests = {};
      pod.containers.forEach((container) => {
        if (container.hasOwnProperty('current_usages')) {
          for (const [resourceName, usage] of Object.entries(container.current_usages)) {
            if (currentUsages.hasOwnProperty(resourceName) === false) {
              currentUsages[resourceName] = 0;
            }
            currentUsages[resourceName] = currentUsages[resourceName] + usage;
          }
        }
        if (container.hasOwnProperty('limits')) {
          for (const [resourceName, limit] of Object.entries(container.limits)) {
            if (totalLimits.hasOwnProperty(resourceName) === false) {
              totalLimits[resourceName] = 0;
            }
            totalLimits[resourceName] = totalLimits[resourceName] + limit;
          }
        }
        if (container.hasOwnProperty('requests')) {
          for (const [resourceName, request] of Object.entries(container.requests)) {
            if (totalRequests.hasOwnProperty(resourceName) === false) {
              totalRequests[resourceName] = 0;
            }
            totalRequests[resourceName] = totalRequests[resourceName] + request;
          }
        }
      });
      return {
        namespace,
        name,
        currentUsages,
        limits: totalLimits,
        requests: totalRequests,
      };
    });
    return clusterResourceInfo;
  });
};

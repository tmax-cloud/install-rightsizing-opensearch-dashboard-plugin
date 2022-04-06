export const PLUGIN_ID = 'rightsizingDetail';
export const PLUGIN_NAME = 'rightsizing-detail';
export const ROUTE_PATH = 'rightsizingDetail';

export function formatBytes(bytes, decimals = 2) {
  if (bytes === undefined) return undefined;
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

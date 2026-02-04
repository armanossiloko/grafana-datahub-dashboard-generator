export interface BuildDashboardOptions {
  title: string;
  siteId: string;
  uiObject: string;
}

/**
 * Builds the dashboard JSON for POST /api/dashboards/db
 * Uses provided title and adds templating variables siteId and uiObject.
 * Tags: generated, service
 * Refresh: 30s, Timezone: browser
 * Panels: Request Rate (timeseries), Error Rate (timeseries)
 */
export function buildServiceDashboardJson(
  options: BuildDashboardOptions
): { dashboard: object; overwrite: boolean } {
  const { title, siteId, uiObject } = options;

  // Use a generic Prometheus datasource; Grafana will use the default or first Prometheus
  const prometheusDatasource = { type: 'prometheus', uid: 'prometheus' };

  const dashboard = {
    id: null as number | null,
    uid: null as string | null,
    title,
    tags: ['generated', 'service'],
    timezone: 'browser',
    schemaVersion: 38,
    refresh: '30s',
    templating: {
      list: [
        {
          name: 'siteId',
          type: 'custom',
          query: siteId,
          current: { selected: true, text: siteId, value: siteId },
          options: [{ selected: true, text: siteId, value: siteId }],
          hide: 2,
          label: 'Site',
          skipUrlSync: false,
        },
        {
          name: 'uiObject',
          type: 'custom',
          query: uiObject,
          current: { selected: true, text: uiObject, value: uiObject },
          options: [{ selected: true, text: uiObject, value: uiObject }],
          hide: 2,
          label: 'UI Object',
          skipUrlSync: false,
        },
      ],
    },
    panels: [
      {
        id: 1,
        type: 'timeseries',
        title: 'Request Rate',
        gridPos: { x: 0, y: 0, w: 12, h: 8 },
        targets: [
          {
            refId: 'A',
            expr: 'rate(http_requests_total{job="api"}[5m])',
            datasource: prometheusDatasource,
          },
        ],
        fieldConfig: {
          defaults: {
            custom: {
              drawStyle: 'line',
              lineInterpolation: 'linear',
              fillOpacity: 10,
              gradientMode: 'none',
              showPoints: 'auto',
              spanNulls: false,
              stack: false,
            },
          },
        },
        options: {
          legend: { displayMode: 'list', placement: 'bottom', showLegend: true },
        },
      },
      {
        id: 2,
        type: 'timeseries',
        title: 'Error Rate',
        gridPos: { x: 12, y: 0, w: 12, h: 8 },
        targets: [
          {
            refId: 'A',
            expr: 'rate(http_requests_total{job="api",status=~"5.."}[5m])',
            datasource: prometheusDatasource,
          },
        ],
        fieldConfig: {
          defaults: {
            custom: {
              drawStyle: 'line',
              lineInterpolation: 'linear',
              fillOpacity: 10,
              gradientMode: 'none',
              showPoints: 'auto',
              spanNulls: false,
              stack: false,
            },
          },
        },
        options: {
          legend: { displayMode: 'list', placement: 'bottom', showLegend: true },
        },
      },
    ],
  };

  return { dashboard, overwrite: false };
}

/**
 * Builds the dashboard JSON for POST /api/dashboards/db
 * Title: Service Dashboard {YYYY-MM-DD}
 * Tags: generated, service
 * Refresh: 30s, Timezone: browser
 * Panels: Request Rate (timeseries), Error Rate (timeseries)
 */
export function buildServiceDashboardJson(): { dashboard: object; overwrite: boolean } {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const title = `Service Dashboard ${dateStr}`;

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

# Grafana Datahub Dashboard Generator

A custom Grafana panel plugin that creates a pre-configured **Service Dashboard** via a one-click button.

## How to use this plugin

1. **Build** the plugin: `npm run build`
2. **Start** Grafana with the plugin (e.g. `docker-compose up -d` — see below).
3. **Open** http://localhost:3000 (anonymous access is enabled — no login required).
4. **Create a dashboard**: Dashboards → New → Add visualization.
5. **Choose** the **Datahub Dashboard Generator** panel.
6. **Click** the **Create Service Dashboard** button — a new dashboard is created and you are redirected to it.

The new dashboard has two panels (Request Rate and Error Rate) using Prometheus queries. Ensure you have a Prometheus datasource configured (UID `prometheus` by default, or edit the generated dashboard).

## Features

- **Create Service Dashboard** button — generates a dashboard with:
  - Title: `Service Dashboard {YYYY-MM-DD}`
  - Tags: `generated`, `service`
  - Refresh: 30s, Timezone: browser
  - **Request Rate** timeseries: `rate(http_requests_total{job="api"}[5m])`
  - **Error Rate** timeseries: `rate(http_requests_total{job="api",status=~"5.."}[5m])`
- Loading state during the API call
- Error message on failure
- Redirect to the new dashboard URL on success

## Build

```bash
npm install
npm run build
```

Output is in `dist/` (plugin.json, module.js, img/).

## Run and test locally with Docker

1. Build the plugin: `npm run build`
2. Start Grafana with the plugin mounted:

   ```bash
   docker-compose up -d
   ```

3. Open **http://localhost:3000** (anonymous access enabled — no login required)
4. You land on the **Home** dashboard with the **Create Service Dashboard** button — click it

The generated dashboard uses a Prometheus datasource with UID `prometheus`. If your Grafana uses a different Prometheus datasource UID, edit the dashboard after creation or change `dashboardTemplate.ts` and rebuild.

## Manual install (no Docker)

1. Run `npm run build`
2. Copy the `dist/` folder into your Grafana `plugins/` directory as `grafana-datahub-dashboard-generator` (or set `GF_PLUGINS_DIR` and place the contents in a subfolder with that name)
3. Restart Grafana
4. Enable the plugin if required (Settings → Plugins)

## Requirements

- Grafana 10.0+
- React + TypeScript; uses `getBackendSrv()` for authenticated `POST /api/dashboards/db`

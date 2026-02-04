import React, { useState } from 'react';
import { PanelProps } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Button, Input, Select, useTheme2 } from '@grafana/ui';
import { DashboardGeneratorOptions } from './types';
import { buildServiceDashboardJson } from './dashboardTemplate';

interface ApiResponse {
  id?: number;
  uid?: string;
  url?: string;
  status?: string;
  message?: string;
}

/** Mock site options for the dropdown (replace with real API later) */
const MOCK_SITES = [
  { value: 'site-1', label: 'Site 1' },
  { value: 'site-2', label: 'Site 2' },
  { value: 'site-3', label: 'Site 3' },
];

export const SimplePanel: React.FC<PanelProps<DashboardGeneratorOptions>> = () => {
  const theme = useTheme2();
  const [title, setTitle] = useState('');
  const [siteId, setSiteId] = useState<string>(MOCK_SITES[0]?.value ?? '');
  const [uiObject, setUiObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDashboard = async () => {
    setError(null);
    setLoading(true);
    try {
      const { dashboard, overwrite } = buildServiceDashboardJson({
        title: title.trim() || `Service Dashboard ${new Date().toISOString().slice(0, 10)}`,
        siteId,
        uiObject: uiObject.trim(),
      });
      const body = { dashboard, overwrite };
      const backendSrv = getBackendSrv();
      const resp = await backendSrv.post<ApiResponse>('/api/dashboards/db', body);

      if (resp?.status === 'success' && resp?.url) {
        window.location.href = resp.url;
        return;
      }
      setError(resp?.message || 'Dashboard creation failed.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const apiMessage = (err as { data?: { message?: string } })?.data?.message;
      setError(apiMessage || message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
      }}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        placeholder="Dashboard title"
        width={24}
      />
      <Select
        value={MOCK_SITES.find((s) => s.value === siteId) ?? null}
        options={MOCK_SITES}
        onChange={(v) => setSiteId(v?.value ?? '')}
        width={20}
        placeholder="Select site"
      />
      <Input
        value={uiObject}
        onChange={(e) => setUiObject(e.currentTarget.value)}
        placeholder="UI Object Full Path"
        width={20}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="md"
          variant="primary"
          onClick={handleCreateDashboard}
          disabled={loading}
          icon={loading ? undefined : 'plus'}
        >
          {loading ? 'Creating…' : 'Create'}
        </Button>
      </div>
      {error && (
        <div
          style={{
            color: theme.colors.error.text,
            fontSize: theme.typography.size.sm,
            maxWidth: '100%',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

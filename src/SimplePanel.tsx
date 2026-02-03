import React, { useState } from 'react';
import { PanelProps } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Button, useTheme2 } from '@grafana/ui';
import { DashboardGeneratorOptions } from './types';
import { buildServiceDashboardJson } from './dashboardTemplate';

interface ApiResponse {
  id?: number;
  uid?: string;
  url?: string;
  status?: string;
  message?: string;
}

export const SimplePanel: React.FC<PanelProps<DashboardGeneratorOptions>> = () => {
  const theme = useTheme2();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDashboard = async () => {
    setError(null);
    setLoading(true);
    try {
      const { dashboard, overwrite } = buildServiceDashboardJson();
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
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
      }}
    >
      <Button
        size="md"
        variant="primary"
        onClick={handleCreateDashboard}
        disabled={loading}
        icon={loading ? undefined : 'plus'}
      >
        {loading ? 'Creating…' : 'Create Service Dashboard'}
      </Button>
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

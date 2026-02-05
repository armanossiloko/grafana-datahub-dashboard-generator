import { PanelPlugin } from '@grafana/data';
import { DashboardGeneratorPanel } from './DashboardGeneratorPanel';

export const plugin = new PanelPlugin(DashboardGeneratorPanel);

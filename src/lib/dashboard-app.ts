import { dashboardStats, percent, type DashboardStats } from './dashboard-stats';
import { loadProgress } from './progress';

export function dashboardApp() {
  return {
    stats: null as DashboardStats | null,
    percent,

    init() {
      this.refresh();
    },

    refresh() {
      this.stats = dashboardStats(loadProgress().progress);
    },
  };
}

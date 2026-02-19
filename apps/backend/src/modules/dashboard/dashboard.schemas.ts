import { z } from 'zod';

export const dashboardOverviewQuerySchema = z.object({}).passthrough();

export type DashboardOverviewQueryDTO = z.infer<typeof dashboardOverviewQuerySchema>;

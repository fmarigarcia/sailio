import { describe, expect, it } from 'vitest';
import { dashboardOverviewQuerySchema } from '../dashboard.schemas';

describe('dashboard.schemas', () => {
  it('valida query vacía', () => {
    const result = dashboardOverviewQuerySchema.parse({});

    expect(result).toEqual({});
  });

  it('acepta query params opcionales para evolución futura', () => {
    const result = dashboardOverviewQuerySchema.parse({ timezone: 'UTC' });

    expect(result).toEqual({ timezone: 'UTC' });
  });

  it('rechaza query no objeto', () => {
    expect(() => dashboardOverviewQuerySchema.parse('invalid-query')).toThrow();
  });
});

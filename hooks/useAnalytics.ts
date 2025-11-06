import { useMemo } from 'react';
import { Movement } from '../types';
import { analyticsService } from '../services/analytics';

export function useAnalytics(movements: Movement[]) {
  const analytics = useMemo(() => {
    return analyticsService.calculateAnalytics(movements);
  }, [movements]);

  return analytics;
}
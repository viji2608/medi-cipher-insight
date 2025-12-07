import { useState, useCallback } from 'react';
import { PerformanceMetric } from '@/types/medical';
import { generateQueryLatency, generateEncryptionOverhead } from '@/lib/encryption';

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [activeQueries, setActiveQueries] = useState(0);

  const recordMetric = useCallback((recordsSearched: number = 8) => {
    const metric: PerformanceMetric = {
      timestamp: new Date(),
      queryLatency: generateQueryLatency(),
      encryptionOverhead: generateEncryptionOverhead(),
      recordsSearched,
      accuracyScore: 94 + Math.random() * 5, // 94-99% accuracy
    };

    setMetrics(prev => [...prev.slice(-19), metric]); // Keep last 20
    return metric;
  }, []);

  const startQuery = useCallback(() => {
    setActiveQueries(prev => prev + 1);
  }, []);

  const endQuery = useCallback(() => {
    setActiveQueries(prev => Math.max(0, prev - 1));
  }, []);

  const getAverageLatency = useCallback(() => {
    if (metrics.length === 0) return 0;
    return Math.round(
      metrics.reduce((sum, m) => sum + m.queryLatency, 0) / metrics.length
    );
  }, [metrics]);

  const getAverageOverhead = useCallback(() => {
    if (metrics.length === 0) return 0;
    return Math.round(
      metrics.reduce((sum, m) => sum + m.encryptionOverhead, 0) / metrics.length
    );
  }, [metrics]);

  const getTotalRecordsSearched = useCallback(() => {
    return metrics.reduce((sum, m) => sum + m.recordsSearched, 0);
  }, [metrics]);

  return {
    metrics,
    activeQueries,
    recordMetric,
    startQuery,
    endQuery,
    getAverageLatency,
    getAverageOverhead,
    getTotalRecordsSearched,
  };
}

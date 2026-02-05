import { useState, useEffect } from 'react';

export interface ProjectSummary {
  montoTotal: number;
  montoPagado: number;
  montoPendiente: number;
  porcentajeAvance: number;
  moneda: 'USD' | 'UYU';
}

export function useProjectSummary(projectId: string) {
  const [data, setData] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        // Simulación de fetch a Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData({
          montoTotal: 150000,
          montoPagado: 45000,
          montoPendiente: 105000,
          porcentajeAvance: 30,
          moneda: 'USD'
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchSummary();
    }
  }, [projectId]);

  return { data, loading, error };
}

import { useEffect, useState } from 'react';
import { fetchDashboardData } from '../utils/fetchDashboardData';

export const useDashboardData = () => {
  const [data, setData] = useState({ scores: [], modules: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchDashboardData();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { ...data, loading, error };
};
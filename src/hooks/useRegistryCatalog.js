import { useEffect, useState } from 'react';
import { getRegistryCatalog } from '../services/api/registryService';

export default function useRegistryCatalog() {
  const [data, setData] = useState({
    employees: [],
    teams: [],
    projects: [],
    skills: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    getRegistryCatalog()
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...data, loading, error };
}

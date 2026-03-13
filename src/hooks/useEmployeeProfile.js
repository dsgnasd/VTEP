import { useEffect, useState } from 'react';
import { getEmployeeById } from '../services/api/employeeService';

export default function useEmployeeProfile(id) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    setLoading(true);

    getEmployeeById(id)
      .then((result) => {
        if (!active) return;
        setEmployee(result);
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
  }, [id]);

  return { employee, loading, error };
}

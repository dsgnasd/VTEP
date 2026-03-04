import { useState, useMemo, useCallback } from 'react';

// ──────────────────────────────────────────────────────────────
// useEmployeeFilters — central filtering logic consumed by both
// the table and timeline views.  Keeps all filter state in one
// place so the two views stay in sync.
// ──────────────────────────────────────────────────────────────

const INITIAL_FILTERS = {
  search: '',
  teams: [],       // multi-select
  projects: [],    // multi-select (project IDs)
  skills: [],      // multi-select
  allocation: '',  // Full-time | Partial | Bench
  status: '',      // Available | Partial | Vacation | Bench
};

export default function useEmployeeFilters(employees) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      // Name search
      if (
        filters.search &&
        !emp.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      // Team multi-select
      if (filters.teams.length > 0 && !filters.teams.includes(emp.team))
        return false;

      // Projects multi-select
      if (
        filters.projects.length > 0 &&
        !filters.projects.some((pid) =>
          emp.allocations.some((a) => a.projectId === pid)
        )
      )
        return false;

      // Skills multi-select
      if (
        filters.skills.length > 0 &&
        !filters.skills.some((s) => emp.skills.some((es) => es.name === s))
      )
        return false;

      // Allocation bucket
      if (filters.allocation) {
        if (filters.allocation === 'Full-time' && emp.totalAllocation < 80)
          return false;
        if (
          filters.allocation === 'Partial' &&
          (emp.totalAllocation >= 80 || emp.totalAllocation === 0)
        )
          return false;
        if (filters.allocation === 'Bench' && emp.totalAllocation !== 0)
          return false;
      }

      // Status
      if (filters.status && emp.status !== filters.status) return false;

      return true;
    });
  }, [employees, filters]);

  return { filters, setFilter, resetFilters, filtered };
}

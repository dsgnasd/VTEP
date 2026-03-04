import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employees } from '../data/mockData';
import useEmployeeFilters from '../hooks/useEmployeeFilters';
import FiltersPanel from '../components/registry/FiltersPanel';
import EmployeeTable from '../components/registry/EmployeeTable';
import TimelineView from '../components/registry/TimelineView';
import CompareView from '../components/registry/CompareView';

// ──────────────────────────────────────────────────────────────
// RegistryPage — реестр сотрудников с фильтрами, переключением
// между табличным / таймлайн режимами и сравнением таймлайнов.
// ──────────────────────────────────────────────────────────────

export default function RegistryPage({ search }) {
  const [view, setView] = useState('table');
  const { filters, setFilter, resetFilters, filtered } =
    useEmployeeFilters(employees);
  const [searchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  useEffect(() => {
    setFilter('search', search);
  }, [search, setFilter]);

  useEffect(() => {
    const skill = searchParams.get('skill');
    if (skill) {
      setFilter('skills', [skill]);
    }
  }, [searchParams, setFilter]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleCompare = useCallback(() => {
    setView('compare');
  }, []);

  const handleBackFromCompare = useCallback(() => {
    setView('table');
  }, []);

  const selectedEmployees = useMemo(
    () => filtered.filter((e) => selectedIds.has(e.id)),
    [filtered, selectedIds]
  );

  // Compare mode
  if (view === 'compare') {
    return (
      <CompareView
        employees={selectedEmployees}
        onBack={handleBackFromCompare}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок + переключатель вида */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">
          Реестр сотрудников
        </h1>
        <div className="flex w-fit border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('table')}
            className={`px-4 py-1.5 text-sm font-medium transition ${
              view === 'table'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Таблица
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`px-4 py-1.5 text-sm font-medium transition border-l border-gray-300 ${
              view === 'timeline'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Таймлайн
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <FiltersPanel
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
        resultCount={filtered.length}
      />

      {/* Вид */}
      {view === 'table' ? (
        <EmployeeTable
          employees={filtered}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      ) : (
        <TimelineView
          employees={filtered}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      )}

      {/* Floating Action Bar */}
      <div
        className={`fixed bottom-6 inset-x-0 z-50 flex justify-center lg:pl-60 pointer-events-none transition-all duration-300 ${
          selectedIds.size >= 2
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-xl shadow-2xl shadow-gray-900/30">
          <span className="text-sm">
            Выбрано <strong className="font-semibold">{selectedIds.size}</strong>
          </span>
          <button
            onClick={handleCompare}
            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm font-medium transition-colors"
          >
            Сравнить
          </button>
          <button
            onClick={clearSelection}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Сбросить выбор"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Подсказка — появляется при выборе 1 сотрудника */}
      {selectedIds.size === 1 && (
        <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center lg:pl-60 pointer-events-none">
          <div className="pointer-events-auto px-4 py-2.5 bg-gray-800 text-white/80 rounded-lg shadow-lg text-sm">
            Выберите ещё хотя бы одного сотрудника для сравнения
          </div>
        </div>
      )}
    </div>
  );
}

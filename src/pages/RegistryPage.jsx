import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employees } from '../data/mockData';
import useEmployeeFilters from '../hooks/useEmployeeFilters';
import FiltersPanel from '../components/registry/FiltersPanel';
import EmployeeTable from '../components/registry/EmployeeTable';
import TimelineView from '../components/registry/TimelineView';
import CompareView from '../components/registry/CompareView';
import TeamsView from '../components/registry/TeamsView';

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
  const [compareSource, setCompareSource] = useState('table');
  const [teamDetailOpen, setTeamDetailOpen] = useState(false);

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
    setCompareSource(view);
    setView('compare');
  }, [view]);

  const handleBackFromCompare = useCallback(() => {
    setView(compareSource);
  }, [compareSource]);

  const selectedEmployees = useMemo(
    () => filtered.filter((e) => selectedIds.has(e.id)),
    [filtered, selectedIds]
  );

  // Compare mode
  if (view === 'compare') {
    return (
      <CompareView
        employees={selectedEmployees}
        allEmployees={employees}
        onBack={handleBackFromCompare}
        defaultTab={compareSource === 'timeline' ? 'timeline' : 'profiles'}
      />
    );
  }

  const VIEW_TABS = ['Таблица', 'Таймлайн'];
  const viewMap = { 'Таблица': 'table', 'Таймлайн': 'timeline' };
  const viewLabel = VIEW_TABS.find((t) => viewMap[t] === view) || 'Таблица';

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Реестр сотрудников</h1>
        <p className="mt-1 text-sm text-gray-500">Поиск, сравнение сотрудников и управление командами</p>
      </div>

      {/* Мои команды — всегда видны */}
      <TeamsView employees={employees} onDetailChange={setTeamDetailOpen} />

      {/* Скрываем таблицу/таймлайн когда открыта детальная команда */}
      {!teamDetailOpen && (
        <>
          {/* Вкладки Таблица / Таймлайн */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-0.5 p-0.5 rounded-lg">
            {VIEW_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setView(viewMap[tab])}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  viewLabel === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
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
            <div className="floating-bar pointer-events-auto flex items-center gap-3 px-5 py-3 text-white rounded-xl">
              <span className="text-sm">
                Выбрано <strong className="font-semibold">{selectedIds.size}</strong>
              </span>
              <button
                onClick={handleCompare}
                className="floating-bar-btn px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              >
                Сравнить
              </button>
              <button
                onClick={clearSelection}
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors"
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
              <div className="floating-bar pointer-events-auto px-4 py-2.5 text-white/80 rounded-lg text-sm">
                Выберите ещё хотя бы одного сотрудника для сравнения
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

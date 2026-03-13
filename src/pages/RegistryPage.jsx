import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useEmployeeFilters from '../hooks/useEmployeeFilters';
import useRegistryCatalog from '../hooks/useRegistryCatalog';
import FiltersPanel from '../components/registry/FiltersPanel';
import EmployeeTable from '../components/registry/EmployeeTable';
import TimelineView from '../components/registry/TimelineView';
import CompareView from '../components/registry/CompareView';
import TeamsView from '../components/registry/TeamsView';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Tabs from '../components/ui/Tabs';

// ──────────────────────────────────────────────────────────────
// RegistryPage — реестр сотрудников с фильтрами, переключением
// между табличным / таймлайн режимами и сравнением таймлайнов.
// ──────────────────────────────────────────────────────────────

export default function RegistryPage({ search }) {
  const [view, setView] = useState('table');
  const { employees, teams, projects, skills, loading, error } = useRegistryCatalog();
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

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Реестр сотрудников"
          description="Поиск, сравнение сотрудников и управление командами"
        />
        <Card padding="lg" className="min-h-[320px] flex items-center justify-center">
          <EmptyState
            title="Загружаем каталог сотрудников"
            description="Подготавливаем реестр, команды и фильтры"
            className="max-w-sm"
          />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Реестр сотрудников"
          description="Поиск, сравнение сотрудников и управление командами"
        />
        <Card padding="lg" className="min-h-[320px] flex items-center justify-center">
          <EmptyState
            title="Не удалось загрузить реестр"
            description="Проверьте источник данных или подключение к API-слою"
            className="max-w-sm"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Реестр сотрудников"
        description="Поиск, сравнение сотрудников и управление командами"
      />

      {/* Мои команды — всегда видны */}
      <TeamsView employees={employees} onDetailChange={setTeamDetailOpen} />

      {/* Скрываем таблицу/таймлайн когда открыта детальная команда */}
      {!teamDetailOpen && (
        <>
          {/* Вкладки Таблица / Таймлайн */}
          <Tabs
            tabs={VIEW_TABS.map((tab) => ({ value: tab, label: tab }))}
            value={viewLabel}
            onChange={(tab) => setView(viewMap[tab])}
          />

          {/* Фильтры */}
          <FiltersPanel
            filters={filters}
            setFilter={setFilter}
            resetFilters={resetFilters}
            resultCount={filtered.length}
            teams={teams}
            projects={projects}
            skills={skills}
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
              <Button
                onClick={handleCompare}
                size="sm"
                className="floating-bar-btn px-4 py-1.5"
              >
                Сравнить
              </Button>
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

import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { teams as allTeams, projects, allSkills } from '../../data/mockData';

// ──────────────────────────────────────────────────────────────
// FiltersPanel — горизонтальная панель фильтров с выпадающими
// списками и чипами активных значений.
// ──────────────────────────────────────────────────────────────

/* ── Обёртка дропдауна ── */
function Dropdown({ label, children, count }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`h-8 px-3 rounded-md border text-sm flex items-center gap-1.5 transition
                    ${count ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}`}
      >
        {label}
        {count > 0 && (
          <span className="ml-0.5 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
        <svg className={`w-3.5 h-3.5 ml-0.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[200px] py-1">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Множественный выбор ── */
function MultiSelect({ options, selected, onChange, labels }) {
  const toggle = useCallback(
    (val) => {
      onChange(
        selected.includes(val)
          ? selected.filter((v) => v !== val)
          : [...selected, val]
      );
    },
    [selected, onChange]
  );

  return (
    <div className="max-h-56 overflow-y-auto">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-sm"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
          />
          {labels ? labels[opt] || opt : opt}
        </label>
      ))}
    </div>
  );
}

/* ── Одиночный выбор ── */
function SingleSelect({ options, selected, onChange, placeholder = 'Все' }) {
  return (
    <div className="max-h-56 overflow-y-auto">
      <button
        onClick={() => onChange('')}
        className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${
          !selected ? 'font-medium text-blue-600' : 'text-gray-600'
        }`}
      >
        {placeholder}
      </button>
      {options.map((opt) => (
        <button
          key={typeof opt === 'string' ? opt : opt.value}
          onClick={() => onChange(typeof opt === 'string' ? opt : opt.value)}
          className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${
            selected === (typeof opt === 'string' ? opt : opt.value)
              ? 'font-medium text-blue-600'
              : 'text-gray-700'
          }`}
        >
          {typeof opt === 'string' ? opt : opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Чип активного фильтра ── */
function FilterChip({ category, label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-xs text-blue-700">
      <span className="text-blue-400 font-medium">{category}:</span>
      <span className="font-medium max-w-[140px] truncate">{label}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 p-0.5 rounded hover:bg-blue-100 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

const ALLOCATION_LABELS = {
  'Full-time': 'Полная',
  'Partial': 'Частичная',
  'Bench': 'На скамейке',
};

const STATUS_LABELS = {
  'Available': 'Доступен',
  'Partial': 'Частично',
  'Vacation': 'Отпуск',
  'Bench': 'На скамейке',
};

const PROJECT_MAP = Object.fromEntries(projects.map((p) => [p.id, p.name]));

function FiltersPanel({ filters, setFilter, resetFilters, resultCount }) {
  const hasActive =
    filters.teams.length > 0 ||
    filters.projects.length > 0 ||
    filters.skills.length > 0 ||
    filters.allocation ||
    filters.status;

  /* Build list of active chips */
  const chips = [];

  filters.teams.forEach((t) =>
    chips.push({
      key: `team-${t}`,
      category: 'Отдел',
      label: t,
      onRemove: () => setFilter('teams', filters.teams.filter((v) => v !== t)),
    })
  );

  filters.projects.forEach((pid) =>
    chips.push({
      key: `project-${pid}`,
      category: 'Проект',
      label: PROJECT_MAP[pid] || pid,
      onRemove: () => setFilter('projects', filters.projects.filter((v) => v !== pid)),
    })
  );

  filters.skills.forEach((s) =>
    chips.push({
      key: `skill-${s}`,
      category: 'Навык',
      label: s,
      onRemove: () => setFilter('skills', filters.skills.filter((v) => v !== s)),
    })
  );

  if (filters.allocation) {
    chips.push({
      key: `alloc-${filters.allocation}`,
      category: 'Загрузка',
      label: ALLOCATION_LABELS[filters.allocation] || filters.allocation,
      onRemove: () => setFilter('allocation', ''),
    });
  }

  if (filters.status) {
    chips.push({
      key: `status-${filters.status}`,
      category: 'Статус',
      label: STATUS_LABELS[filters.status] || filters.status,
      onRemove: () => setFilter('status', ''),
    });
  }

  return (
    <div className="space-y-2">
      {/* Dropdown buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Отдел */}
        <Dropdown label="Отдел" count={filters.teams.length}>
          <MultiSelect
            options={allTeams}
            selected={filters.teams}
            onChange={(v) => setFilter('teams', v)}
          />
        </Dropdown>

        {/* Проект */}
        <Dropdown label="Проект" count={filters.projects.length}>
          <MultiSelect
            options={projects.map((p) => p.id)}
            labels={Object.fromEntries(projects.map((p) => [p.id, p.name]))}
            selected={filters.projects}
            onChange={(v) => setFilter('projects', v)}
          />
        </Dropdown>

        {/* Навык */}
        <Dropdown label="Навык" count={filters.skills.length}>
          <MultiSelect
            options={allSkills}
            selected={filters.skills}
            onChange={(v) => setFilter('skills', v)}
          />
        </Dropdown>

        {/* Загрузка */}
        <Dropdown label="Загрузка" count={filters.allocation ? 1 : 0}>
          <SingleSelect
            options={['Full-time', 'Partial', 'Bench'].map((v) => ({ value: v, label: ALLOCATION_LABELS[v] }))}
            selected={filters.allocation}
            onChange={(v) => setFilter('allocation', v)}
          />
        </Dropdown>

        {/* Статус */}
        <Dropdown label="Статус" count={filters.status ? 1 : 0}>
          <SingleSelect
            options={['Available', 'Partial', 'Vacation', 'Bench'].map((v) => ({ value: v, label: STATUS_LABELS[v] }))}
            selected={filters.status}
            onChange={(v) => setFilter('status', v)}
          />
        </Dropdown>

        {/* Сброс */}
        {hasActive && (
          <button
            onClick={resetFilters}
            className="h-8 px-3 rounded-md text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            Сбросить
          </button>
        )}

        {/* Счётчик */}
        <span className="ml-auto text-xs text-gray-500">
          {resultCount} сотр.
        </span>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {chips.map((c) => (
            <FilterChip
              key={c.key}
              category={c.category}
              label={c.label}
              onRemove={c.onRemove}
            />
          ))}
          {chips.length > 1 && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-gray-600 ml-1 transition-colors"
            >
              Очистить все
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(FiltersPanel);

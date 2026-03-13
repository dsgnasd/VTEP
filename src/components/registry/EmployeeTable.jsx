import { memo, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SkillTag from '../shared/SkillTag';
import StatusBadge from '../shared/StatusBadge';

const EMPLOYEE_COL_WIDTH = 'w-56 min-w-[224px]';

/* ── Сокращение имени: «Фамилия И. О.» ── */
function shortName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const surname = parts[0];
  const initials = parts.slice(1).map((p) => p[0]?.toUpperCase() + '.').join(' ');
  return `${surname} ${initials}`;
}

const COLUMNS = [
  { key: 'name', label: 'Сотрудник', sticky: true },
  { key: 'role', label: 'Должность' },
  { key: 'team', label: 'Отдел' },
  { key: 'projects', label: 'Проекты' },
  { key: 'totalAllocation', label: 'Загрузка' },
  { key: 'status', label: 'Статус' },
  { key: 'skills', label: 'Навыки' },
];

function sortEmployees(list, sortKey, sortDir) {
  if (!sortKey) return list;
  return [...list].sort((a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];
    if (Array.isArray(av)) av = av.length;
    if (Array.isArray(bv)) bv = bv.length;
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

/* ── Мобильная карточка сотрудника ── */
function EmployeeCard({ emp, selectable, isSelected, onToggleSelect }) {
  return (
    <div
      className={`rounded-xl border p-3.5 transition-colors ${
        isSelected
          ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-500/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
    >
      {/* Row 1: checkbox + name + status */}
      <div className="flex items-start gap-2.5">
        {selectable && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(emp.id)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/employee/${emp.id}`}
              className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {shortName(emp.name)}
            </Link>
            <StatusBadge status={emp.status} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{emp.role}</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{emp.team}</p>
        </div>
      </div>

      {/* Row 2: allocation bar */}
      <div className="flex items-center gap-2 mt-2.5">
        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              emp.totalAllocation >= 80
                ? 'bg-emerald-500'
                : emp.totalAllocation > 0
                  ? 'bg-amber-400'
                  : 'bg-gray-300'
            }`}
            style={{ width: `${emp.totalAllocation}%` }}
          />
        </div>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums w-7 text-right">
          {emp.totalAllocation}%
        </span>
      </div>

      {/* Row 3: projects */}
      {emp.allocations.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {emp.allocations.map((a) => (
            <span
              key={a.projectId}
              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-gray-700 text-[11px] text-gray-600 dark:text-gray-400"
            >
              {a.projectName}
            </span>
          ))}
        </div>
      )}

      {/* Row 4: skills */}
      {emp.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {emp.skills.slice(0, 3).map((s) => (
            <SkillTag key={s.name} name={s.name} />
          ))}
          {emp.skills.length > 3 && (
            <span className="text-[11px] text-gray-500 dark:text-gray-400 self-center">
              +{emp.skills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function EmployeeTable({ employees, selectedIds, onToggleSelect }) {
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const selectable = !!onToggleSelect;

  const handleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
    },
    [sortKey]
  );

  const sorted = useMemo(
    () => sortEmployees(employees, sortKey, sortDir),
    [employees, sortKey, sortDir]
  );

  const allVisibleSelected =
    selectable && sorted.length > 0 && sorted.every((e) => selectedIds.has(e.id));
  const someSelected =
    selectable && sorted.some((e) => selectedIds.has(e.id));

  const handleSelectAll = useCallback(() => {
    if (allVisibleSelected) {
      sorted.forEach((e) => onToggleSelect(e.id));
    } else {
      sorted.forEach((e) => {
        if (!selectedIds.has(e.id)) onToggleSelect(e.id);
      });
    }
  }, [allVisibleSelected, sorted, selectedIds, onToggleSelect]);

  if (sorted.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        Сотрудники не найдены по текущим фильтрам.
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile: card list ── */}
      <div className="md:hidden space-y-2">
        {sorted.map((emp) => (
          <EmployeeCard
            key={emp.id}
            emp={emp}
            selectable={selectable}
            isSelected={selectable && selectedIds.has(emp.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>

      {/* ── Desktop: table ── */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <table className="w-full min-w-[880px] text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/60">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`ui-table-label text-left whitespace-nowrap select-none cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors
                    ${col.sticky ? `${EMPLOYEE_COL_WIDTH} sticky left-0 z-10 bg-gray-50/80 dark:bg-gray-800/60 border-r border-gray-200 dark:border-gray-700/80 px-0 py-0` : 'px-4 py-2.5'}`}
                >
                  {col.sticky ? (
                    <div className="flex items-center px-4 py-2.5">
                      {selectable && (
                        <span
                          className="w-8 flex-shrink-0 flex items-center justify-center mr-3"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = someSelected && !allVisibleSelected;
                            }}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key && (
                          <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" viewBox="0 0 12 12" fill="currentColor">
                            {sortDir === 'asc' ? (
                              <path d="M6 2l4 5H2z" />
                            ) : (
                              <path d="M6 10l4-5H2z" />
                            )}
                          </svg>
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" viewBox="0 0 12 12" fill="currentColor">
                          {sortDir === 'asc' ? (
                            <path d="M6 2l4 5H2z" />
                          ) : (
                            <path d="M6 10l4-5H2z" />
                          )}
                        </svg>
                      )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {sorted.map((emp) => {
              const isSelected = selectable && selectedIds.has(emp.id);
              return (
                <tr
                  key={emp.id}
                  className={`group transition-colors ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-500/10 hover:bg-blue-50 dark:hover:bg-blue-500/15'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                  }`}
                >
                  <td className={`${EMPLOYEE_COL_WIDTH} sticky z-10 px-4 py-2.5 border-r border-gray-200 dark:border-gray-700/80 transition-colors ${
                    'left-0'
                    } ${isSelected ? 'bg-blue-50 dark:bg-blue-500/15' : 'bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800'
                  }`}>
                    <div className="flex items-center min-w-0">
                      {selectable && (
                        <span className="w-8 flex-shrink-0 flex items-center justify-center mr-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelect(emp.id)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </span>
                      )}
                      <Link
                        to={`/employee/${emp.id}`}
                        className="block min-w-0 font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                        title={emp.name}
                      >
                        {shortName(emp.name)}
                      </Link>
                    </div>
                  </td>

                  <td className="px-4 py-2.5" title={emp.role}>
                    <span className="block max-w-[180px] truncate text-gray-600 dark:text-gray-400">
                      {emp.role}
                    </span>
                  </td>

                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {emp.team}
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 flex-nowrap">
                      {emp.allocations.slice(0, 2).map((a) => (
                        <span
                          key={a.projectId}
                          className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap"
                        >
                          {a.projectName}
                        </span>
                      ))}
                      {emp.allocations.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          +{emp.allocations.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            emp.totalAllocation >= 80
                              ? 'bg-emerald-500'
                              : emp.totalAllocation > 0
                                ? 'bg-amber-400'
                                : 'bg-gray-300'
                          }`}
                          style={{ width: `${emp.totalAllocation}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums w-8">
                        {emp.totalAllocation}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <StatusBadge status={emp.status} />
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 flex-nowrap">
                      {emp.skills.slice(0, 3).map((s) => (
                        <SkillTag key={s.name} name={s.name} />
                      ))}
                      {emp.skills.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          +{emp.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default memo(EmployeeTable);

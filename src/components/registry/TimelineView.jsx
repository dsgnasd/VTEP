import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AllocationBlock from '../shared/AllocationBlock';

function shortName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return `${parts[0]} ${parts.slice(1).map((p) => p[0]?.toUpperCase() + '.').join(' ')}`;
}

const TIMELINE_START = new Date('2026-01-01');
const TIMELINE_END = new Date('2026-04-01');
const TOTAL_DAYS = Math.round((TIMELINE_END - TIMELINE_START) / 86400000);

const MONTHS = [
  { label: 'Январь 2026', days: 31 },
  { label: 'Февраль 2026', days: 28 },
  { label: 'Март 2026', days: 31 },
];

function dayOffset(dateStr) {
  const d = new Date(dateStr);
  return Math.max(0, Math.round((d - TIMELINE_START) / 86400000));
}

function toPercent(days) {
  return (days / TOTAL_DAYS) * 100;
}

function getAllocationType(percentage) {
  if (percentage >= 80) return 'full';
  if (percentage > 0) return 'partial';
  return 'bench';
}

function TimelineView({ employees, selectedIds, onToggleSelect }) {
  const selectable = !!onToggleSelect;

  const monthWidths = useMemo(
    () => MONTHS.map((m) => toPercent(m.days)),
    []
  );

  const allVisibleSelected =
    selectable && employees.length > 0 && employees.every((e) => selectedIds.has(e.id));
  const someSelected =
    selectable && employees.some((e) => selectedIds.has(e.id));

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      employees.forEach((e) => onToggleSelect(e.id));
    } else {
      employees.forEach((e) => {
        if (!selectedIds.has(e.id)) onToggleSelect(e.id);
      });
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Заголовок месяцев */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10">
          <div className="w-52 min-w-[208px] flex-shrink-0 py-2.5 sticky left-0 bg-gray-50/80 z-20 border-r border-gray-200">
            <div className="flex items-center">
              {selectable && (
                <div className="w-8 flex-shrink-0 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allVisibleSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              )}
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 px-2">
                Сотрудник
              </span>
            </div>
          </div>
          <div className="flex-1 flex">
            {MONTHS.map((m, i) => (
              <div
                key={m.label}
                className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 px-3 py-3 text-center border-r border-gray-100 last:border-r-0"
                style={{ width: `${monthWidths[i]}%` }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* Строки сотрудников */}
        {employees.map((emp) => {
          const isSelected = selectable && selectedIds.has(emp.id);
          return (
            <div
              key={emp.id}
              className={`flex border-b border-gray-100 transition-colors ${
                isSelected
                  ? 'bg-blue-50/60 hover:bg-blue-50'
                  : 'hover:bg-gray-50/40'
              }`}
            >
              <div className={`w-52 min-w-[208px] flex-shrink-0 py-2.5 sticky left-0 z-10 border-r border-gray-200 ${
                isSelected ? 'bg-blue-50' : 'bg-white'
              }`}>
                <div className="flex items-center">
                  {selectable && (
                    <div className="w-8 flex-shrink-0 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(emp.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  )}
                  <Link
                    to={`/employee/${emp.id}`}
                    className="text-[13px] font-medium text-gray-900 hover:text-blue-600 truncate transition-colors px-2"
                    title={emp.name}
                  >
                    {shortName(emp.name)}
                  </Link>
                </div>
              </div>

              <div className="flex-1 relative h-[42px]">
                {emp.allocations.map((a) => {
                  const start = dayOffset(a.startDate);
                  const end = dayOffset(a.endDate);
                  const left = toPercent(start);
                  const width = toPercent(Math.max(end - start, 1));
                  return (
                    <AllocationBlock
                      key={a.projectId}
                      type={getAllocationType(a.percentage)}
                      left={left}
                      width={width}
                      label={a.projectName}
                      percentage={a.percentage}
                    />
                  );
                })}

                {emp.vacation.map((v, i) => {
                  const start = dayOffset(v.startDate);
                  const end = dayOffset(v.endDate);
                  const left = toPercent(start);
                  const width = toPercent(Math.max(end - start, 1));
                  return (
                    <AllocationBlock
                      key={`vac-${i}`}
                      type="vacation"
                      left={left}
                      width={width}
                      label="Отпуск"
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {employees.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">
            Сотрудники не найдены по текущим фильтрам.
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TimelineView);

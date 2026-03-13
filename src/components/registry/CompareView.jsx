import { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AllocationBlock from '../shared/AllocationBlock';
import StatusBadge from '../shared/StatusBadge';
import useTeams from '../../hooks/useTeams';
import { TeamModal } from './TeamsView';

// ──────────────────────────────────────────────────────────────
// CompareView — сравнение выбранных сотрудников:
//  • Таймлайн — загрузка + отпуска с подсветкой пересечений
//  • Профили — навыки, роли, загрузка, сертификации бок о бок
// ──────────────────────────────────────────────────────────────

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

/* ── Overlap computation ── */
function computeOverlaps(employees) {
  const bitmap = new Uint8Array(TOTAL_DAYS);
  for (const emp of employees) {
    for (const v of emp.vacation) {
      const s = dayOffset(v.startDate);
      const e = Math.min(dayOffset(v.endDate), TOTAL_DAYS);
      for (let d = s; d < e; d++) bitmap[d]++;
    }
  }

  const ranges = [];
  let start = -1;
  for (let d = 0; d <= TOTAL_DAYS; d++) {
    if (d < TOTAL_DAYS && bitmap[d] >= 2) {
      if (start === -1) start = d;
    } else {
      if (start !== -1) {
        ranges.push({ start, end: d, count: Math.max(...bitmap.slice(start, d)) });
        start = -1;
      }
    }
  }

  const overlapDays = bitmap.filter((v) => v >= 2).length;

  const vacBitmap = new Uint8Array(TOTAL_DAYS);
  for (const emp of employees) {
    for (const v of emp.vacation) {
      const s = dayOffset(v.startDate);
      const e = Math.min(dayOffset(v.endDate), TOTAL_DAYS);
      for (let d = s; d < e; d++) vacBitmap[d] = 1;
    }
  }
  const allAvailableDays = vacBitmap.filter((v) => v === 0).length;

  return { ranges, overlapDays, allAvailableDays };
}

/* ── Collect all unique skills across employees ── */
function collectSkillMatrix(employees) {
  const skillMap = new Map();
  for (const emp of employees) {
    for (const s of emp.skills) {
      if (!skillMap.has(s.name)) skillMap.set(s.name, new Map());
      skillMap.get(s.name).set(emp.id, s.level);
    }
  }
  // Sort by how many employees have the skill (desc)
  return [...skillMap.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .map(([name, levels]) => ({ name, levels }));
}

const LEVEL_COLORS = {
  Senior: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  Middle: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  Junior: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
};

const LEVEL_ORDER = { Senior: 3, Middle: 2, Junior: 1 };

/* ── Tab: Timeline ── */
function TimelineTab({ employees, ranges, monthWidths }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
          <div className="w-44 min-w-[176px] flex-shrink-0 px-4 py-2.5 text-xs font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-20 border-r border-gray-200 dark:border-gray-700">
            Сотрудник
          </div>
          <div className="flex-1 flex">
            {MONTHS.map((m, i) => (
              <div
                key={m.label}
                className="text-xs font-medium text-gray-600 dark:text-gray-400 px-3 py-2.5 text-center border-r border-gray-100 dark:border-gray-700/50 last:border-r-0"
                style={{ width: `${monthWidths[i]}%` }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {employees.map((emp) => (
          <div
            key={emp.id}
            className="flex border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/40 dark:hover:bg-gray-700/40 transition-colors"
          >
            <div className="w-44 min-w-[176px] flex-shrink-0 px-4 py-2 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-700">
              <Link
                to={`/employee/${emp.id}`}
                className="text-sm font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block transition-colors"
              >
                {emp.name}
              </Link>
            </div>

            <div className="flex-1 relative h-9">
              {ranges.map((r) => (
                <div
                  key={`ovl-${r.start}`}
                  className="absolute top-0 bottom-0 bg-red-100/50 border-l border-r border-red-200/40 dark:bg-red-500/15 dark:border-red-400/30"
                  style={{
                    left: `${toPercent(r.start)}%`,
                    width: `${toPercent(r.end - r.start)}%`,
                  }}
                />
              ))}

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
        ))}
      </div>
    </div>
  );
}

/* ── Tab: Profiles ── */
function ProfilesTab({ employees, skillMatrix }) {
  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="overflow-x-auto">
        <div className="flex gap-3" style={{ minWidth: `${employees.length * 220}px` }}>
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="flex-1 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3"
            >
              <div>
                <Link
                  to={`/employee/${emp.id}`}
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {emp.name}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{emp.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{emp.team}</p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={emp.status} />
              </div>

              {/* Allocation bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Загрузка</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{emp.totalAllocation}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      emp.totalAllocation >= 80
                        ? 'bg-emerald-500'
                        : emp.totalAllocation > 0
                          ? 'bg-amber-400'
                          : 'bg-gray-300'
                    }`}
                    style={{ width: `${emp.totalAllocation}%` }}
                  />
                </div>
              </div>

              {/* Projects */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Проекты</p>
                <div className="flex flex-wrap gap-1">
                  {emp.allocations.map((a) => (
                    <span
                      key={a.projectId}
                      className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-gray-700 text-[11px] text-gray-700 dark:text-gray-300"
                    >
                      {a.projectName} {a.percentage}%
                    </span>
                  ))}
                </div>
              </div>

              {/* Certs */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Сертификации</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{emp.certificates}</span>
              </div>

              {/* Vacation */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Отпуска</p>
                {emp.vacation.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Нет запланированных</p>
                ) : (
                  <div className="space-y-0.5">
                    {emp.vacation.map((v, i) => (
                      <p key={i} className="text-xs text-red-600 dark:text-red-400">
                        {new Date(v.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        {' – '}
                        {new Date(v.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills matrix */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Матрица навыков</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Сравнение компетенций и уровней</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/60">
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 sticky left-0 bg-gray-50/50 dark:bg-gray-800/60 z-10 min-w-[140px]">
                  Навык
                </th>
                {employees.map((emp) => (
                  <th key={emp.id} className="text-center px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 min-w-[120px]">
                    {emp.name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skillMatrix.map(({ name, levels }) => (
                <tr key={name} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/60 dark:hover:bg-gray-700/40">
                  <td className="px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-800 z-10">
                    {name}
                  </td>
                  {employees.map((emp) => {
                    const level = levels.get(emp.id);
                    return (
                      <td key={emp.id} className="text-center px-3 py-1.5">
                        {level ? (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${LEVEL_COLORS[level] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                            {level}
                          </span>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Main CompareView ── */

function CompareView({ employees, allEmployees, onBack, defaultTab = 'timeline' }) {
  const [tab, setTab] = useState(defaultTab);
  const { createTeam } = useTeams();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const monthWidths = useMemo(
    () => MONTHS.map((m) => toPercent(m.days)),
    []
  );

  const { ranges, overlapDays, allAvailableDays } = useMemo(
    () => computeOverlaps(employees),
    [employees]
  );

  const skillMatrix = useMemo(
    () => collectSkillMatrix(employees),
    [employees]
  );

  const tabs = [
    { id: 'timeline', label: 'Таймлайн' },
    { id: 'profiles', label: 'Профили и навыки' },
  ];

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Хедер */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Назад к реестру
            </button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Сравнение
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {employees.length} сотр.
            </span>
          </div>
          <button
            onClick={() => setSaveModalOpen(true)}
            className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium transition shadow-sm ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saved ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Команда сохранена
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                Сохранить команду
              </>
            )}
          </button>
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-0.5 p-0.5 rounded-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
              tab === t.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Сводка */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Пересечение отпусков: <strong className="font-semibold text-gray-900 dark:text-gray-100">{overlapDays} дн.</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Все доступны: <strong className="font-semibold text-gray-900 dark:text-gray-100">{allAvailableDays} дн.</strong>
          </span>
        </div>
        {ranges.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-700/50">
            <svg className="w-4 h-4 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span className="text-sm text-amber-800 dark:text-amber-300">
              {ranges.length} период{ranges.length > 1 ? 'а' : ''} с наложением
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      {tab === 'timeline' ? (
        <>
          <TimelineTab employees={employees} ranges={ranges} monthWidths={monthWidths} />
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm bg-emerald-500" />
              Загрузка ≥80%
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm bg-amber-400" />
              Частичная
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm bg-red-400" />
              Отпуск
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm bg-red-100 border border-red-200 dark:bg-red-500/15 dark:border-red-400/30" />
              Пересечение (2+ чел.)
            </div>
          </div>
        </>
      ) : (
        <ProfilesTab employees={employees} skillMatrix={skillMatrix} />
      )}

      <TeamModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={(name, memberIds, visibility) => {
          createTeam(name, memberIds, visibility);
          setSaved(true);
        }}
        employees={allEmployees || employees}
        initial={{ name: '', memberIds: employees.map((e) => e.id) }}
      />
    </div>
  );
}

export default memo(CompareView);

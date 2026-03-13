import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillTag from '../shared/SkillTag';
import StatusBadge from '../shared/StatusBadge';
import AllocationBlock from '../shared/AllocationBlock';

// ──────────────────────────────────────────────────────────────
// EmployeeProfile — полный профиль сотрудника: заголовок,
// прогресс-бар, навыки, проекты, мини-таймлайн, достижения,
// виджет отпусков.
// ──────────────────────────────────────────────────────────────

const TIMELINE_START = new Date('2026-01-01');
const TIMELINE_END = new Date('2026-04-01');
const TOTAL_DAYS = Math.round((TIMELINE_END - TIMELINE_START) / 86400000);

function dayOffset(dateStr) {
  const d = new Date(dateStr);
  return Math.max(0, Math.round((d - TIMELINE_START) / 86400000));
}
function toPercent(days) {
  return (days / TOTAL_DAYS) * 100;
}
function getAllocationType(pct) {
  if (pct >= 80) return 'full';
  if (pct > 0) return 'partial';
  return 'bench';
}

function EmployeeProfile({ employee }) {
  const navigate = useNavigate();
  const emp = employee;

  const handleSkillClick = (skillName) => {
    navigate(`/registry?skill=${encodeURIComponent(skillName)}`);
  };

  const monthLabels = ['Янв', 'Фев', 'Мар'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Заголовок ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-start gap-5">
          <img
            src={emp.avatar}
            alt={emp.name}
            className="w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-700 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{emp.name}</h1>
              <StatusBadge status={emp.status} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{emp.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{emp.team}</p>
          </div>
        </div>

        {/* Заполненность профиля */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Заполненность профиля</span>
            <span className="text-xs text-gray-500">{emp.completionScore}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                emp.completionScore >= 80
                  ? 'bg-emerald-500'
                  : emp.completionScore >= 50
                    ? 'bg-amber-400'
                    : 'bg-red-400'
              }`}
              style={{ width: `${emp.completionScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Навыки ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Навыки</h2>
        <div className="flex flex-wrap gap-2">
          {emp.skills.map((s) => (
            <SkillTag
              key={s.name}
              name={s.name}
              level={s.level}
              onClick={() => handleSkillClick(s.name)}
            />
          ))}
          {emp.skills.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Навыки не указаны.</p>
          )}
        </div>
      </div>

      {/* ── Проекты ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Проекты</h2>
        {emp.allocations.length > 0 ? (
          <div className="space-y-3">
            {emp.allocations.map((a) => (
              <div
                key={a.projectId}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{a.projectName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {a.role} &middot; {a.startDate} — {a.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        a.percentage >= 80
                          ? 'bg-emerald-500'
                          : a.percentage > 0
                            ? 'bg-amber-400'
                            : 'bg-gray-300'
                      }`}
                      style={{ width: `${a.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 tabular-nums w-8 text-right">
                    {a.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Нет назначенных проектов.</p>
        )}
      </div>

      {/* ── Мини-таймлайн ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Таймлайн (Q1 2026)</h2>
        <div className="relative">
          <div className="flex mb-1">
            {monthLabels.map((m) => (
              <div key={m} className="flex-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                {m}
              </div>
            ))}
          </div>
          <div className="relative h-8 bg-gray-100 dark:bg-gray-700/50 rounded overflow-hidden">
            {emp.allocations.map((a) => {
              const start = dayOffset(a.startDate);
              const end = dayOffset(a.endDate);
              return (
                <AllocationBlock
                  key={a.projectId}
                  type={getAllocationType(a.percentage)}
                  left={toPercent(start)}
                  width={toPercent(Math.max(end - start, 1))}
                  label={a.projectName}
                  percentage={a.percentage}
                />
              );
            })}
            {emp.vacation.map((v, i) => {
              const start = dayOffset(v.startDate);
              const end = dayOffset(v.endDate);
              return (
                <AllocationBlock
                  key={`vac-${i}`}
                  type="vacation"
                  left={toPercent(start)}
                  width={toPercent(Math.max(end - start, 1))}
                  label="Отпуск"
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Достижения ── */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Достижения</h2>
          {emp.achievements.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {emp.achievements.map((a) => (
                <div
                  key={a.title}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40"
                >
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-100">{a.title}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Пока нет достижений.</p>
          )}
        </div>

        {/* ── Отпуск ── */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Отпуск</h2>
          {emp.vacation.length > 0 ? (
            <div className="space-y-2">
              {emp.vacation.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
                >
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      {v.startDate} — {v.endDate}
                    </p>
                    <p className="text-xs text-red-500">
                      {Math.round((new Date(v.endDate) - new Date(v.startDate)) / 86400000)} дн.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Нет запланированных отпусков.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(EmployeeProfile);

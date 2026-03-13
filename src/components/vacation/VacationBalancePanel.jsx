// ──────────────────────────────────────────────────────────────
// VacationBalancePanel — детальный просмотр отпускного баланса.
// Props: balance { available, used, total, currentYearRemaining,
//                  carryover, workYearStart, workYearEnd }
// ──────────────────────────────────────────────────────────────

function parseDate(ddmmyyyy) {
  const [d, m, y] = ddmmyyyy.split('.');
  return new Date(+y, +m - 1, +d);
}

function daysLabel(n) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return 'дней';
  if (last === 1) return 'день';
  if (last >= 2 && last <= 4) return 'дня';
  return 'дней';
}

/* ── Micro-components ── */

function StatCard({ value, label, accent }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4">
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold ${accent}`}>{value}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{daysLabel(value)}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`} />
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}:</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
}

/* ── Icons ── */
const CalendarIcon = (
  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

/* ── Main component ── */

export default function VacationBalancePanel({ balance }) {
  const { available, used, total, currentYearRemaining, carryover, workYearStart, workYearEnd } = balance;

  /* work year progress */
  const wsDate = parseDate(workYearStart);
  const weDate = parseDate(workYearEnd);
  const now = new Date();
  const yearTotal = weDate - wsDate;
  const yearElapsed = Math.max(0, Math.min(now - wsDate, yearTotal));
  const yearPct = yearTotal > 0 ? Math.round((yearElapsed / yearTotal) * 100) : 0;

  /* stacked bar percentages */
  const usedPct = total > 0 ? (used / total) * 100 : 0;
  const curPct = total > 0 ? (currentYearRemaining / total) * 100 : 0;
  const carryPct = total > 0 ? (carryover / total) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* ── Zone 1: Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard value={available} label="Общий остаток" accent="text-blue-600" />
        <StatCard value={currentYearRemaining} label="Текущий рабочий год" accent="text-emerald-600" />
        <StatCard value={carryover} label="Перешло с прошлого года" accent="text-amber-600" />
      </div>

      {/* ── Zone 2: Work year ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="ui-section-label mb-4">
          Рабочий год
        </h3>
        <div className="flex items-center gap-2.5 mb-3">
          {CalendarIcon}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {workYearStart} — {workYearEnd}
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${yearPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Начало: {workYearStart}</span>
          <span>Окончание: {workYearEnd}</span>
        </div>
      </div>

      {/* ── Zone 3: Usage breakdown ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="ui-section-label mb-4">
          Использование отпуска
        </h3>
        {/* Stacked bar */}
        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
          <div className="h-full bg-blue-500" style={{ width: `${usedPct}%` }} />
          <div className="h-full bg-emerald-400" style={{ width: `${curPct}%` }} />
          <div className="h-full bg-amber-400" style={{ width: `${carryPct}%` }} />
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
          <LegendItem color="bg-blue-500" label="Использовано" value={`${used} дн.`} />
          <LegendItem color="bg-emerald-400" label="Текущий год" value={`${currentYearRemaining} дн.`} />
          <LegendItem color="bg-amber-400" label="Перенос" value={`${carryover} дн.`} />
        </div>
      </div>
    </div>
  );
}

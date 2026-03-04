import { useState, useMemo, useCallback } from 'react';

// ──────────────────────────────────────────────────────────────
// DateRangePicker — двухмесячный компактный календарь с выбором
// диапазона дат. Показывает текущий и следующий месяц рядом.
// Props: startDate, endDate (строки YYYY-MM-DD), onChange(start, end), minDate
// ──────────────────────────────────────────────────────────────

const MONTHS = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];
const WDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

const pad = (n) => String(n).padStart(2, '0');
const toStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromStr = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const same = (a, b) => a && b && a.getTime() === b.getTime();
const addMonth = (y, m) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 });

function buildGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const prevTotal = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = offset - 1; i >= 0; i--)
    cells.push({ d: new Date(year, month - 1, prevTotal - i), cur: false });
  for (let i = 1; i <= total; i++)
    cells.push({ d: new Date(year, month, i), cur: true });
  while (cells.length % 7 !== 0 || cells.length < 35)
    cells.push({ d: new Date(year, month + 1, cells.length - offset - total + 1), cur: false });

  return cells;
}

const Chevron = ({ left }) => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={left ? 'M15.75 19.5L8.25 12l7.5-7.5' : 'M8.25 4.5l7.5 7.5-7.5 7.5'}
    />
  </svg>
);

export default function DateRangePicker({ startDate, endDate, onChange, minDate }) {
  const start = useMemo(() => fromStr(startDate), [startDate]);
  const end = useMemo(() => fromStr(endDate), [endDate]);
  const min = useMemo(() => fromStr(minDate), [minDate]);

  const [view, setView] = useState(() => {
    const ref = start || new Date();
    return { y: ref.getFullYear(), m: ref.getMonth() };
  });
  const [hovered, setHovered] = useState(null);

  const phase = start && !end ? 'end' : 'start';

  /* two month grids */
  const leftCells = useMemo(() => buildGrid(view.y, view.m), [view.y, view.m]);
  const r = addMonth(view.y, view.m);
  const rightCells = useMemo(() => buildGrid(r.y, r.m), [r.y, r.m]);

  const prev = useCallback(() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 })), []);
  const next = useCallback(() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 })), []);

  const handleClick = useCallback(
    (cell) => {
      if (!cell.cur || (min && cell.d < min)) return;
      const s = toStr(cell.d);
      if (phase === 'start') {
        onChange(s, '');
      } else {
        if (cell.d < start) onChange(s, startDate);
        else onChange(startDate, s);
      }
    },
    [phase, start, startDate, min, onChange],
  );

  /* effective range including hover preview */
  let rS = start,
    rE = end;
  if (phase === 'end' && start && !end && hovered) {
    if (hovered < start) { rS = hovered; rE = start; }
    else { rS = start; rE = hovered; }
  }
  const hasRange = rS && rE && !same(rS, rE);

  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  /* ── Shared grid renderer ── */
  const renderGrid = (cells) => (
    <div className="grid grid-cols-7" onMouseLeave={() => setHovered(null)}>
      {cells.map((cell, i) => {
        const col = i % 7;
        const disabled = !cell.cur || (min && cell.d < min);
        const isS = rS && same(cell.d, rS) && cell.cur;
        const isE = rE && same(cell.d, rE) && cell.cur;
        const inR = hasRange && cell.cur && cell.d > rS && cell.d < rE;
        const isToday = same(cell.d, today) && cell.cur;

        let band = '';
        if (hasRange && cell.cur) {
          if (isS) band = 'drp-start';
          else if (isE) band = 'drp-end';
          else if (inR) {
            band = 'drp-range';
            if (col === 0) band += ' rounded-l-full';
            if (col === 6) band += ' rounded-r-full';
          }
        }

        let cls =
          'relative w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs transition-colors';
        if (disabled) {
          cls += ' text-gray-300 dark:text-gray-600 cursor-default';
        } else if (isS || isE) {
          cls += ' bg-blue-600 dark:bg-indigo-500 text-white font-semibold shadow-sm';
        } else if (inR) {
          cls += ' text-blue-700 dark:text-indigo-300 hover:bg-blue-100/60 dark:hover:bg-indigo-400/20 cursor-pointer';
        } else {
          cls += ' text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer';
          if (isToday) cls += ' ring-1 ring-inset ring-blue-400 dark:ring-indigo-400 font-semibold';
        }

        return (
          <div
            key={i}
            className={`py-px ${band}`}
            onMouseEnter={() => { if (!disabled && phase === 'end') setHovered(cell.d); }}
          >
            <button type="button" disabled={disabled} onClick={() => handleClick(cell)} className={cls}>
              {cell.d.getDate()}
            </button>
          </div>
        );
      })}
    </div>
  );

  const weekHeader = (prefix) => (
    <div className="grid grid-cols-7 mb-0.5">
      {WDAYS.map((w) => (
        <div key={`${prefix}-${w}`} className="text-center text-[10px] font-medium text-gray-400 dark:text-gray-500 py-0.5">
          {w}
        </div>
      ))}
    </div>
  );

  return (
    <div className="select-none">
      <div className="flex gap-5">
        {/* ── Left month ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <button
              type="button"
              onClick={prev}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-500 dark:text-gray-400"
            >
              <Chevron left />
            </button>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {MONTHS[view.m]} {view.y}
            </span>
            <span className="w-5" />
          </div>
          {weekHeader('l')}
          {renderGrid(leftCells)}
        </div>

        {/* ── Right month ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="w-5" />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {MONTHS[r.m]} {r.y}
            </span>
            <button
              type="button"
              onClick={next}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-500 dark:text-gray-400"
            >
              <Chevron />
            </button>
          </div>
          {weekHeader('r')}
          {renderGrid(rightCells)}
        </div>
      </div>

      {/* ── Hint ── */}
      {(!start || !end) && (
        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 text-center">
          {!start ? 'Выберите дату начала' : 'Теперь выберите дату окончания'}
        </p>
      )}
    </div>
  );
}

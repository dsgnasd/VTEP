import { memo } from 'react';

// ──────────────────────────────────────────────────────────────
// StatusBadge — пилюля статуса доступности сотрудника.
// ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Available: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700',
  Partial: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700',
  Vacation: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700',
  Bench: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
};

const STATUS_LABELS = {
  Available: 'Доступен',
  Partial: 'Частично',
  Vacation: 'Отпуск',
  Bench: 'На скамейке',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        STATUS_STYLES[status] || STATUS_STYLES.Bench
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default memo(StatusBadge);

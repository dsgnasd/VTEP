import { memo } from 'react';

// ──────────────────────────────────────────────────────────────
// StatusBadge — пилюля статуса доступности сотрудника.
// ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Partial: 'bg-amber-50 text-amber-700 border-amber-200',
  Vacation: 'bg-red-50 text-red-700 border-red-200',
  Bench: 'bg-gray-100 text-gray-600 border-gray-200',
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

import { memo } from 'react';

// ──────────────────────────────────────────────────────────────
// AllocationBlock — a colored bar representing a time allocation
// on a horizontal timeline.  Position & width are passed as
// percentages of the total timeline width.
// ──────────────────────────────────────────────────────────────

const TYPE_STYLES = {
  full: 'bg-emerald-500',
  partial: 'bg-amber-400',
  bench: 'bg-gray-300',
  vacation: 'bg-red-400',
};

function AllocationBlock({ type = 'full', left, width, label, percentage }) {
  return (
    <div
      className={`absolute top-2 bottom-2 rounded ${TYPE_STYLES[type] || TYPE_STYLES.full} flex items-center overflow-hidden`}
      style={{ left: `${left}%`, width: `${width}%` }}
      title={label}
    >
      {width > 6 && (
        <span className="px-1.5 text-[10px] font-medium text-white truncate">
          {label}{percentage != null ? ` ${percentage}%` : ''}
        </span>
      )}
    </div>
  );
}

export default memo(AllocationBlock);

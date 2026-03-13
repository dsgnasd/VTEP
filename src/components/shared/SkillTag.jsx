import { memo } from 'react';

// ──────────────────────────────────────────────────────────────
// SkillTag — renders a skill name with an optional level badge.
// Optionally clickable to trigger a filter action.
// ──────────────────────────────────────────────────────────────

const LEVEL_COLORS = {
  Junior: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50',
  Middle: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50',
  Senior: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50',
  Lead: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50',
};

function SkillTag({ name, level, onClick }) {
  const colorClass = level
    ? LEVEL_COLORS[level] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  const Tag = onClick ? 'button' : 'span';

  return (
    <Tag
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border
                  ${colorClass} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      {name}
      {level && (
        <span className="text-[10px] opacity-70">{level}</span>
      )}
    </Tag>
  );
}

export default memo(SkillTag);

import { memo } from 'react';

// ──────────────────────────────────────────────────────────────
// SkillTag — renders a skill name with an optional level badge.
// Optionally clickable to trigger a filter action.
// ──────────────────────────────────────────────────────────────

const LEVEL_COLORS = {
  Junior: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Middle: 'bg-blue-50 text-blue-700 border-blue-200',
  Senior: 'bg-amber-50 text-amber-700 border-amber-200',
  Lead: 'bg-purple-50 text-purple-700 border-purple-200',
};

function SkillTag({ name, level, onClick }) {
  const colorClass = level ? LEVEL_COLORS[level] || 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-gray-100 text-gray-700 border-gray-200';
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

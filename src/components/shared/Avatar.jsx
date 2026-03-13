import { memo, useEffect, useState } from 'react';

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?';
}

function isPlaceholderAvatar(src) {
  return !src || src.includes('/initials/svg');
}

function Avatar({ src, name, className = '' }) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [src]);

  if (!isPlaceholderAvatar(src) && !hasImageError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasImageError(true)}
        className={className}
      />
    );
  }

  return (
    <div
      aria-label={name}
      role="img"
      className={`flex items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600/80 text-slate-700 dark:text-gray-100 font-semibold ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

export default memo(Avatar);

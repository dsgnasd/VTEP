import { memo } from 'react';
import { Link } from 'react-router-dom';

// ──────────────────────────────────────────────────────────────
// Topbar — responsive top bar with hamburger (mobile),
// search input, and user avatar linking to /my-profile.
// ──────────────────────────────────────────────────────────────

function Topbar({ search, onSearchChange, onMobileMenuOpen }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-1.5 -ml-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
          aria-label="Открыть меню"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Search */}
        <div className="relative w-48 sm:w-72 lg:w-80">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Поиск сотрудников…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm
                       placeholder:text-gray-400 focus:outline-none focus:ring-2
                       focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right side — user info + avatar → My Profile */}
      <Link
        to="/my-profile"
        className="flex items-center gap-2.5 px-2 py-1.5 -mr-2 rounded-lg hover:bg-gray-50 transition group"
      >
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900 leading-tight">Павел Пирожков</p>
          <p className="text-[11px] text-gray-500 leading-tight">Staff Engineer</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
          ПП
        </div>
      </Link>
    </header>
  );
}

export default memo(Topbar);

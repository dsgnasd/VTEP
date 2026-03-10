import { memo } from 'react';
import { NavLink } from 'react-router-dom';

// ──────────────────────────────────────────────────────────────
// Sidebar — collapsible left navigation.
// collapsed = icons only (w-16), expanded = icons + labels (w-60).
// On mobile (<lg) it renders as a full-width drawer overlay —
// always expanded regardless of the desktop collapsed state.
// ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    to: '/my-profile',
    label: 'Мой профиль',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    to: '/registry',
    label: 'Сотрудники',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    to: '/requests',
    label: 'Заявки',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  {
    to: '/projects',
    label: 'Проекты',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
      </svg>
    ),
  },
];

/* Renders nav links — isCompact controls icon-only vs icon+label */
function NavContent({ isCompact, onItemClick, light }) {
  return (
    <>
      {/* Brand header */}
      <div className={`h-14 flex items-center border-b flex-shrink-0 ${light ? 'border-gray-200' : 'border-white/10'}`}>
        {isCompact ? (
          <div className="w-full flex justify-center">
            <span className={`font-bold text-lg ${light ? 'text-gray-900' : 'text-white'}`}>EP</span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-4">
            <span className={`font-semibold text-[15px] tracking-tight ${light ? 'text-gray-900' : 'text-white'}`}>
              Employee Portal
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item, idx) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 animate-slide-up ${idx === 0 ? '' : idx === 1 ? 'animation-delay-100' : idx === 2 ? 'animation-delay-200' : 'animation-delay-300'}
               ${isCompact ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
               ${isActive
                  ? light
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'bg-white/10 text-white shadow-sm'
                  : light
                    ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
               }`
            }
            title={isCompact ? item.label : undefined}
          >
            {item.icon}
            {!isCompact && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

const THEME_ICON = {
  light: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  ),
  dark: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  ),
  system: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
    </svg>
  ),
};

const THEME_LABEL = {
  light: 'Светлая',
  dark: 'Тёмная',
  system: 'Система',
};

function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, themeMode, isDark, onCycleTheme }) {
  const sidebarWidth = collapsed ? 'w-16' : 'w-60';
  const isLight = !isDark;
  const bgClass = isLight ? 'bg-white border-r border-gray-200' : 'bg-sidebar';
  const borderClass = isLight ? 'border-gray-200' : 'border-white/10';
  const btnClass = isLight
    ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    : 'text-slate-400 hover:bg-white/5 hover:text-white';

  return (
    <>
      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* ── Mobile drawer — always expanded ── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-60 ${bgClass} flex flex-col z-50
                     transform transition-transform duration-300 ease-in-out lg:hidden
                     ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <NavContent isCompact={false} onItemClick={onMobileClose} light={isLight} />

        {/* Theme toggle — mobile */}
        <div className={`border-t ${borderClass} p-2 flex-shrink-0`}>
          <button
            onClick={onCycleTheme}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${btnClass}`}
          >
            {THEME_ICON[themeMode]}
            <span>{THEME_LABEL[themeMode]}</span>
          </button>
        </div>
      </aside>

      {/* ── Desktop sidebar — respects collapsed state ── */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 bottom-0 ${bgClass} flex-col z-30
                     transition-all duration-300 ease-in-out ${sidebarWidth}`}
      >
        <NavContent isCompact={collapsed} onItemClick={undefined} light={isLight} />

        {/* Theme toggle — desktop */}
        <div className={`border-t ${borderClass} p-2 flex-shrink-0`}>
          <button
            onClick={onCycleTheme}
            className={`w-full flex items-center gap-2 rounded-lg transition-all duration-200 text-sm
                       ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'} ${btnClass}`}
            title={THEME_LABEL[themeMode]}
          >
            {THEME_ICON[themeMode]}
            {!collapsed && <span>{THEME_LABEL[themeMode]}</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <div className={`border-t ${borderClass} p-2 flex-shrink-0`}>
          <button
            onClick={onToggle}
            className={`w-full flex items-center gap-2 rounded-lg transition-all duration-200 text-sm
                       ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'} ${btnClass}`}
            title={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
            {!collapsed && <span>Свернуть</span>}
          </button>
        </div>

      </aside>
    </>
  );
}

export default memo(Sidebar);

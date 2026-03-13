import { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import RegistryPage from './pages/RegistryPage';
import ProfilePage from './pages/ProfilePage';
import MyProfilePage from './pages/MyProfilePage';
import RequestsPage from './pages/RequestsPage';
import ProjectsPage from './pages/ProjectsPage';

// ──────────────────────────────────────────────────────────────
// App — root layout with collapsible sidebar + responsive topbar.
// Sidebar collapsed state persists per session.
// On mobile (<lg) sidebar is a drawer overlay.
// ──────────────────────────────────────────────────────────────

const THEME_MODES = ['light', 'dark', 'system'];

function getStoredThemeMode() {
  if (typeof window === 'undefined') return 'system';

  try {
    const saved = window.localStorage.getItem('theme');
    return THEME_MODES.includes(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

function getSystemPrefersDark() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function App() {
  const [search, setSearch] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(getStoredThemeMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark);

  const isDark = themeMode === 'system' ? systemPrefersDark : themeMode === 'dark';

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      setSystemPrefersDark(event.matches);
    };

    setSystemPrefersDark(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);

    try {
      window.localStorage.setItem('theme', themeMode);
    } catch {
      // Ignore storage errors so theme switching still works in restricted environments.
    }
  }, [isDark, themeMode]);

  const cycleTheme = useCallback(() => {
    setThemeMode((mode) => {
      const currentIndex = THEME_MODES.indexOf(mode);
      const nextIndex = (currentIndex + 1) % THEME_MODES.length;
      return THEME_MODES[nextIndex];
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((c) => !c);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const openMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);

  // Main content margin matches sidebar width on desktop
  const mainMargin = sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        themeMode={themeMode}
        isDark={isDark}
        onCycleTheme={cycleTheme}
      />

      {/* Main area */}
      <div className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${mainMargin}`}>
        <Topbar
          search={search}
          onSearchChange={setSearch}
          onMobileMenuOpen={openMobile}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<MyProfilePage />} />
            <Route path="/registry" element={<RegistryPage search={search} />} />
            <Route path="/employee/:id" element={<ProfilePage />} />
            <Route path="/my-profile" element={<MyProfilePage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

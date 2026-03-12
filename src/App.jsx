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

export default function App() {
  const [search, setSearch] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const isDark = themeMode === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', themeMode);
  }, [isDark, themeMode]);

  const cycleTheme = useCallback(() => {
    setThemeMode((m) => (m === 'light' ? 'dark' : 'light'));
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

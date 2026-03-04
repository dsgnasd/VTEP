// ──────────────────────────────────────────────────────────────
// DashboardPage — landing page with summary widgets.
// Content TBD — renders an empty-state shell for now.
// ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Дашборд</h1>
        <p className="mt-1 text-sm text-gray-500">
          Обзор ключевых метрик и активности команды
        </p>
      </div>

      {/* KPI cards — empty shells */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Всего сотрудников', icon: '👥' },
          { label: 'На проектах', icon: '💼' },
          { label: 'На скамейке', icon: '⏸️' },
          { label: 'В отпуске', icon: '🌴' },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4"
          >
            <span className="text-2xl">{card.icon}</span>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-300">—</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[240px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Загрузка команды</p>
            <p className="text-xs text-gray-500 mt-1">Раздел в разработке</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[240px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Последняя активность</p>
            <p className="text-xs text-gray-500 mt-1">Раздел в разработке</p>
          </div>
        </div>
      </div>
    </div>
  );
}

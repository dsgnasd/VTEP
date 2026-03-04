import { useState } from 'react';
import VacationRequestModal from '../components/vacation/VacationRequestModal';
import VacationBalancePanel from '../components/vacation/VacationBalancePanel';

// ──────────────────────────────────────────────────────────────
// RequestsPage — employee requests / tickets management.
// ──────────────────────────────────────────────────────────────

const VACATION_BALANCE = {
  available: 10,
  used: 18,
  total: 28,
  currentYearRemaining: 7,
  carryover: 3,
  workYearStart: '12.03.2025',
  workYearEnd: '11.03.2026',
};

const TABS = ['Отпуск', 'На согласовании', 'Завершённые'];

export default function RequestsPage() {
  const [vacationModalOpen, setVacationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Отпуск');

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Заявки</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление заявками и запросами
          </p>
        </div>
        <button
          onClick={() => setVacationModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition self-start"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Новая заявка
        </button>
      </div>

      {/* Tab bar */}
      <div>
        <div className="flex flex-wrap justify-center sm:justify-start gap-0.5 p-0.5 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'Отпуск' ? (
        <VacationBalancePanel balance={VACATION_BALANCE} />
      ) : (
        /* Empty state */
        <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Заявок пока нет</p>
            <p className="text-xs text-gray-500 mt-1.5">
              Здесь будут отображаться ваши заявки на отпуск, оборудование, доступы и другие запросы
            </p>
          </div>
        </div>
      )}

      <VacationRequestModal
        open={vacationModalOpen}
        onClose={() => setVacationModalOpen(false)}
        vacationBalance={VACATION_BALANCE}
      />
    </div>
  );
}

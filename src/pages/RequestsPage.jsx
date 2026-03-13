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

function LegalInfoAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full"
        aria-expanded={open}
      >
        <h3 className="ui-section-label">
          Правовая информация
        </h3>
        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      {open && (
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Трудовой отпуск</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Ст. 155 ТК РБ — минимальная продолжительность 24 календарных дня. Первый отпуск за рабочий период должен быть не менее 14 дней.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Социальный отпуск / Отгул</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Ст. 183–191 ТК РБ — предоставляется по семейным обстоятельствам (свадьба, рождение ребёнка, похороны) или за ранее отработанное сверхурочное время. Без сохранения зарплаты.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Больничный лист</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Оплачивается с первого дня нетрудоспособности. Необходимо предоставить скан или фото листка нетрудоспособности при подаче заявки.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  const [vacationModalOpen, setVacationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Отпуск');

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="ui-page-title text-gray-900 dark:text-gray-100">Заявки</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Управление заявками и запросами
          </p>
        </div>
        <button
          onClick={() => setVacationModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition self-start shadow-sm shadow-blue-900/20"
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
              className={`ui-tab-trigger ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'Отпуск' ? (
        <div className="space-y-4">
          <VacationBalancePanel balance={VACATION_BALANCE} />

          {/* Legal info block — accordion */}
          <LegalInfoAccordion />
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Заявок пока нет</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
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

import { Link } from 'react-router-dom';

// ──────────────────────────────────────────────────────────────
// DashboardPage — personal dashboard for the employee.
// Sections: Status, Alerts, Quick Actions, Opportunities.
// ──────────────────────────────────────────────────────────────

/* ── Mock data ── */

const STATUS = {
  workload: 140, // percent
  projects: [
    { name: 'API Gateway', role: 'Lead Engineer', load: 100 },
    { name: 'Интернет-банк 3.0', role: 'Staff Engineer', load: 40 },
  ],
  vacation: { available: 10, used: 18, total: 28, next: { start: '23 июня', end: '7 июля' } },
  skills: 6,
  profileCompletion: 60,
  idpProgress: 2, // completed goals
  idpTotal: 4,
  courses: { active: 1, total: 3 },
};

const ALERTS = [
  {
    id: 1,
    type: 'warning',
    title: 'Перегрузка',
    text: 'Текущая загрузка 140% — рекомендуется обсудить с руководителем перераспределение.',
    icon: 'exclamation',
  },
  {
    id: 2,
    type: 'info',
    title: 'Незаполненный профиль',
    text: 'Заполните образование и языки для повышения видимости профиля.',
    icon: 'profile',
    link: '/my-profile',
  },
  {
    id: 3,
    type: 'success',
    title: 'Отпуск приближается',
    text: 'Запланирован отпуск: 23 июня — 7 июля. Убедитесь, что задачи переданы.',
    icon: 'calendar',
  },
];

const OPPORTUNITIES = [
  {
    id: 1,
    title: 'Проект «Аналитика 2.0»',
    description: 'Ищут Senior Go разработчика. Совпадение с вашими навыками: 85%',
    match: 85,
    type: 'project',
  },
  {
    id: 2,
    title: 'Kubernetes Advanced Security',
    description: 'Новый курс от Internal Academy. Релевантно вашему ИПР.',
    type: 'course',
  },
  {
    id: 3,
    title: 'Менторство для Ивана Бубликова',
    description: 'Junior Go разработчик ищет ментора. Отдел: Platform.',
    type: 'mentoring',
  },
];

/* ── Helpers ── */

function alertStyles(type) {
  switch (type) {
    case 'warning':
      return { bg: 'bg-amber-50', icon: 'text-amber-500', text: 'text-amber-900' };
    case 'success':
      return { bg: 'bg-emerald-50', icon: 'text-emerald-500', text: 'text-emerald-900' };
    default:
      return { bg: 'bg-blue-50', icon: 'text-blue-500', text: 'text-blue-900' };
  }
}

function AlertIcon({ type }) {
  if (type === 'exclamation')
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    );
  if (type === 'profile')
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    );
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}

function OpportunityBadge({ type }) {
  const map = {
    project: { label: 'Проект', cls: 'bg-blue-100 text-blue-700' },
    course: { label: 'Курс', cls: 'bg-purple-100 text-purple-700' },
    mentoring: { label: 'Менторство', cls: 'bg-emerald-100 text-emerald-700' },
  };
  const b = map[type] || map.project;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.cls}`}>{b.label}</span>;
}

/* ── Main component ── */

export default function DashboardPage() {
  const overloaded = STATUS.workload > 100;

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Дашборд</h1>
        <p className="mt-1 text-sm text-gray-500">Ваш персональный обзор</p>
      </div>

      {/* ── Status cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Workload */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">Загрузка</p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${overloaded ? 'bg-red-100' : 'bg-emerald-100'}`}>
              <svg className={`w-4 h-4 ${overloaded ? 'text-red-600' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold ${overloaded ? 'text-red-600' : 'text-gray-900'}`}>{STATUS.workload}%</p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${overloaded ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(STATUS.workload, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{STATUS.projects.length} активных проекта</p>
        </div>

        {/* Vacation */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">Отпуск</p>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{STATUS.vacation.available} <span className="text-sm font-normal text-gray-500">дн. осталось</span></p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(STATUS.vacation.used / STATUS.vacation.total) * 100}%` }} />
          </div>
          {STATUS.vacation.next && (
            <p className="text-xs text-gray-500 mt-2">
              Ближайший: {STATUS.vacation.next.start} — {STATUS.vacation.next.end}
            </p>
          )}
        </div>

        {/* IDP progress */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">ИПР</p>
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{STATUS.idpProgress}<span className="text-sm font-normal text-gray-500">/{STATUS.idpTotal} целей</span></p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(STATUS.idpProgress / STATUS.idpTotal) * 100}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{STATUS.courses.active} курс в процессе</p>
        </div>

        {/* Profile */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">Профиль</p>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{STATUS.profileCompletion}%</p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${STATUS.profileCompletion}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{STATUS.skills} навыков подтверждено</p>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Уведомления</h2>
        <div className="space-y-2">
          {ALERTS.map((alert) => {
            const s = alertStyles(alert.type);
            const content = (
              <div key={alert.id} className={`flex items-start gap-3 px-5 py-3.5 rounded-xl ${s.bg}`}>
                <div className={`${s.icon} flex-shrink-0 mt-0.5`}>
                  <AlertIcon type={alert.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${s.text}`}>{alert.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{alert.text}</p>
                </div>
              </div>
            );
            return alert.link ? <Link key={alert.id} to={alert.link} className="block">{content}</Link> : <div key={alert.id}>{content}</div>;
          })}
        </div>
      </div>

      {/* ── Bottom row: Actions + Opportunities ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/my-profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">Обновить навыки</p>
                <p className="text-xs text-gray-500">Мой профиль</p>
              </div>
            </Link>
            <Link to="/requests" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">Подать заявку</p>
                <p className="text-xs text-gray-500">Отпуск, больничный</p>
              </div>
            </Link>
            <Link to="/training" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">Мои курсы</p>
                <p className="text-xs text-gray-500">Обучение</p>
              </div>
            </Link>
            <Link to="/projects" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">Проекты</p>
                <p className="text-xs text-gray-500">Каталог проектов</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Opportunities */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Рекомендации</h3>
          <div className="space-y-3">
            {OPPORTUNITIES.map((opp) => (
              <div key={opp.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-800">{opp.title}</p>
                    <OpportunityBadge type={opp.type} />
                  </div>
                  <p className="text-xs text-gray-500">{opp.description}</p>
                </div>
                {opp.match && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex-shrink-0">
                    {opp.match}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active projects breakdown ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Текущие проекты</h3>
        <div className="space-y-3">
          {STATUS.projects.map((p) => (
            <div key={p.name} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{p.load}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.load > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${p.load}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

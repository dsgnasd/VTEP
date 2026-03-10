import { Link } from 'react-router-dom';

// ──────────────────────────────────────────────────────────────
// DashboardPage — Personal dashboard redesigned with:
//
// 1. HIERARCHY — greeting hero → critical banner → metric grid
//    → two-column layout (projects + actions | timeline + recs)
//
// 2. INFORMATION DENSITY — compact stat pills instead of fat
//    cards; projects with role/load inline; alerts prioritized
//
// 3. SCANABILITY — F-pattern: name → date → banner → numbers →
//    two columns of actionable content
//
// 4. DARK MODE — full dark: support via Tailwind `dark:` prefix
// ──────────────────────────────────────────────────────────────

/* ── Mock data ── */

const USER = {
  firstName: 'Павел',
  role: 'Staff Engineer',
  department: 'Platform',
};

const STATUS = {
  workload: 140,
  projects: [
    { name: 'API Gateway', role: 'Lead Engineer', load: 100, status: 'active', deadline: '15 апр' },
    { name: 'Интернет-банк 3.0', role: 'Staff Engineer', load: 40, status: 'active', deadline: '30 июн' },
  ],
  vacation: { available: 10, used: 18, total: 28, next: { start: '23 июня', end: '7 июля' } },
  skills: 6,
  profileCompletion: 60,
  idpProgress: 2,
  idpTotal: 4,
  courses: { active: 1, total: 3 },
};

const ALERTS = [
  {
    id: 1,
    type: 'warning',
    title: 'Перегрузка',
    text: 'Текущая загрузка 140 % — рекомендуется обсудить с руководителем.',
    critical: true,
  },
  {
    id: 2,
    type: 'info',
    title: 'Профиль не заполнен',
    text: 'Добавьте образование и языки.',
    link: '/my-profile',
  },
  {
    id: 3,
    type: 'success',
    title: 'Отпуск скоро',
    text: '23 июня — 7 июля. Передайте задачи.',
  },
];

const OPPORTUNITIES = [
  {
    id: 1,
    title: 'Проект «Аналитика 2.0»',
    desc: 'Ищут Senior Go разработчика',
    match: 85,
    type: 'project',
    cta: 'Подробнее',
  },
  {
    id: 2,
    title: 'Kubernetes Advanced Security',
    desc: 'Релевантно вашему ИПР',
    type: 'course',
    cta: 'Записаться',
  },
  {
    id: 3,
    title: 'Менторство: Иван Бубликов',
    desc: 'Junior Go · Platform',
    type: 'mentoring',
    cta: 'Откликнуться',
  },
];

const TIMELINE = [
  { id: 1, text: 'Согласована заявка на отпуск', time: '2 дня назад', icon: 'check' },
  { id: 2, text: 'Назначен Lead Engineer в API Gateway', time: '1 неделю назад', icon: 'star' },
  { id: 3, text: 'Пройден курс «Go Advanced Patterns»', time: '3 недели назад', icon: 'academic' },
];

/* ── Helpers ── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

function formatDate() {
  return new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function oppColor(type) {
  const m = {
    project: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    course: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    mentoring: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  };
  return m[type] || m.project;
}

function oppLabel(type) {
  const m = { project: 'Проект', course: 'Курс', mentoring: 'Менторство' };
  return m[type] || 'Проект';
}

/* ── Icons (inline SVGs) ── */

function IconChart({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function IconCalendar({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}

function IconAcademic({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  );
}

function IconProfile({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function IconFolder({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
    </svg>
  );
}

function IconArrowRight({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function IconCheck({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function IconStar({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  );
}

function IconWarning({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

function IconEdit({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function TimelineIcon({ type, className }) {
  if (type === 'check') return <IconCheck className={className} />;
  if (type === 'star') return <IconStar className={className} />;
  return <IconAcademic className={className} />;
}

/* ── Sub-components ── */

function MetricCard({ label, value, suffix, icon: Icon, color, progress, sub }) {
  const colorMap = {
    red: {
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconText: 'text-red-600 dark:text-red-400',
      bar: 'bg-red-500',
      value: 'text-red-600 dark:text-red-400',
    },
    blue: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconText: 'text-blue-600 dark:text-blue-400',
      bar: 'bg-blue-500',
      value: 'text-gray-900 dark:text-white',
    },
    purple: {
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconText: 'text-purple-600 dark:text-purple-400',
      bar: 'bg-purple-500',
      value: 'text-gray-900 dark:text-white',
    },
    amber: {
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconText: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500',
      value: 'text-gray-900 dark:text-white',
    },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.iconBg}`}>
          <Icon className={`w-3.5 h-3.5 ${c.iconText}`} />
        </div>
      </div>
      <div>
        <span className={`text-2xl font-bold tracking-tight ${c.value}`}>{value}</span>
        {suffix && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{suffix}</span>}
      </div>
      {progress !== undefined && (
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${c.bar}`} style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      )}
      {sub && <span className="text-[11px] text-gray-500 dark:text-gray-500">{sub}</span>}
    </div>
  );
}

function CriticalBanner({ alert }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent dark:from-red-500/20 dark:via-amber-500/10 border border-red-200/60 dark:border-red-500/20 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
          <IconWarning className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">{alert.title}</p>
          <p className="text-sm text-red-700/80 dark:text-red-400/70 mt-0.5">{alert.text}</p>
        </div>
        <span className="text-2xl font-bold text-red-600 dark:text-red-400 flex-shrink-0 tabular-nums">{STATUS.workload}%</span>
      </div>
    </div>
  );
}

function MiniAlert({ alert }) {
  const styleMap = {
    info: {
      dot: 'bg-blue-500',
      text: 'text-blue-800 dark:text-blue-300',
      sub: 'text-blue-700/70 dark:text-blue-400/60',
    },
    success: {
      dot: 'bg-emerald-500',
      text: 'text-emerald-800 dark:text-emerald-300',
      sub: 'text-emerald-700/70 dark:text-emerald-400/60',
    },
  };
  const s = styleMap[alert.type] || styleMap.info;

  const content = (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#1e293b] border border-gray-100 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#263348] transition-colors">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium ${s.text}`}>{alert.title}</span>
        <span className={`text-xs ml-2 ${s.sub}`}>{alert.text}</span>
      </div>
      {alert.link && <IconArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
    </div>
  );

  return alert.link ? <Link to={alert.link} className="block">{content}</Link> : content;
}

function ProjectRow({ project }) {
  const isHigh = project.load > 80;
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-[#334155] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{project.name}</p>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">{project.role}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isHigh ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${project.load}%` }}
            />
          </div>
          <span className={`text-xs font-semibold tabular-nums ${isHigh ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
            {project.load}%
          </span>
        </div>
      </div>
      {project.deadline && (
        <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap">
          до {project.deadline}
        </span>
      )}
    </div>
  );
}

/* ── Main ── */

export default function DashboardPage() {
  const overloaded = STATUS.workload > 100;
  const criticalAlert = ALERTS.find((a) => a.critical);
  const otherAlerts = ALERTS.filter((a) => !a.critical);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      {/* ── Hero: greeting + date ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getGreeting()}, {USER.firstName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Link
            to="/my-profile"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-[#334155] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#263348] transition-colors"
          >
            <IconEdit className="w-3.5 h-3.5" />
            Мой профиль
          </Link>
          <Link
            to="/requests"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            <IconCalendar className="w-3.5 h-3.5" />
            Подать заявку
          </Link>
        </div>
      </div>

      {/* ── Critical alert banner ── */}
      {criticalAlert && <CriticalBanner alert={criticalAlert} />}

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Загрузка"
          value={`${STATUS.workload}%`}
          icon={IconChart}
          color={overloaded ? 'red' : 'blue'}
          progress={STATUS.workload}
          sub={`${STATUS.projects.length} активных проекта`}
        />
        <MetricCard
          label="Отпуск"
          value={STATUS.vacation.available}
          suffix="дн."
          icon={IconCalendar}
          color="blue"
          progress={(STATUS.vacation.used / STATUS.vacation.total) * 100}
          sub={STATUS.vacation.next ? `${STATUS.vacation.next.start} — ${STATUS.vacation.next.end}` : undefined}
        />
        <MetricCard
          label="ИПР"
          value={STATUS.idpProgress}
          suffix={`/ ${STATUS.idpTotal}`}
          icon={IconAcademic}
          color="purple"
          progress={(STATUS.idpProgress / STATUS.idpTotal) * 100}
          sub={`${STATUS.courses.active} курс в процессе`}
        />
        <MetricCard
          label="Профиль"
          value={`${STATUS.profileCompletion}%`}
          icon={IconProfile}
          color="amber"
          progress={STATUS.profileCompletion}
          sub={`${STATUS.skills} навыков`}
        />
      </div>

      {/* ── Secondary alerts ── */}
      {otherAlerts.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2">
          {otherAlerts.map((a) => (
            <div key={a.id} className="flex-1">
              <MiniAlert alert={a} />
            </div>
          ))}
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Projects + Quick Actions (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Projects */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Текущие проекты</h2>
              <Link to="/projects" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Все проекты
              </Link>
            </div>
            <div>
              {STATUS.projects.map((p) => (
                <ProjectRow key={p.name} project={p} />
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { to: '/my-profile', icon: IconEdit, label: 'Навыки', color: 'blue' },
              { to: '/requests', icon: IconCalendar, label: 'Заявки', color: 'emerald' },
              { to: '/training', icon: IconAcademic, label: 'Обучение', color: 'purple' },
              { to: '/projects', icon: IconFolder, label: 'Проекты', color: 'amber' },
            ].map((a) => {
              const bgMap = {
                blue: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
                emerald: 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
                purple: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
                amber: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30',
              };
              const iconMap = {
                blue: 'text-blue-600 dark:text-blue-400',
                emerald: 'text-emerald-600 dark:text-emerald-400',
                purple: 'text-purple-600 dark:text-purple-400',
                amber: 'text-amber-600 dark:text-amber-400',
              };
              return (
                <Link
                  key={a.to}
                  to={a.to}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent transition-colors ${bgMap[a.color]}`}
                >
                  <a.icon className={`w-5 h-5 ${iconMap[a.color]}`} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{a.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Recommendations + Timeline (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Recommendations */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Рекомендации</h2>
            <div className="space-y-3">
              {OPPORTUNITIES.map((opp) => (
                <div key={opp.id} className="group">
                  <div className="flex items-start gap-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{opp.title}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${oppColor(opp.type)}`}>
                          {oppLabel(opp.type)}
                        </span>
                        {opp.match && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{opp.match}%</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opp.desc}</p>
                    </div>
                  </div>
                  <button className="mt-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    {opp.cta} →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Последние события</h2>
            <div className="space-y-0">
              {TIMELINE.map((ev, i) => (
                <div key={ev.id} className="flex items-start gap-3 relative pb-4 last:pb-0">
                  {/* vertical line */}
                  {i < TIMELINE.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                  )}
                  <div className="w-[22px] h-[22px] rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 z-10">
                    <TimelineIcon type={ev.icon} className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200">{ev.text}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

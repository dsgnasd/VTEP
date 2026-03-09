import { useState, useRef, useEffect } from 'react';
import VacationRequestModal from '../components/vacation/VacationRequestModal';

// ──────────────────────────────────────────────────────────────
// MyProfilePage — redesigned around core UX principles:
//
// 1. VISUAL HIERARCHY — full-width hero header → stat strip →
//    completion nudge → tabbed content.  Eye follows a natural
//    F-pattern: identity → numbers → actions → detail.
//
// 2. PROGRESSIVE DISCLOSURE — bio lives inside the header so
//    the "identity zone" is one cohesive block.  Completion
//    checklist is collapsible (expanded by default) so power
//    users can dismiss it.  Tabs lazy-reveal dense content.
//
// 3. SCANABILITY — contact info uses icons (not labels) for
//    instant pattern recognition.  Stat strip uses large
//    numbers + micro-labels (Gestalt: proximity).
//
// 4. MOBILE-FIRST — single-column stacks naturally; sidebar
//    drops below main content on < lg.  Touch targets ≥ 44px.
//
// 5. ACTIONABILITY — primary CTA "Редактировать" stands out;
//    completion items each have a direct "Заполнить" affordance.
//    Vacation CTA is secondary (outline) — not competing.
// ──────────────────────────────────────────────────────────────

/* ── Mock current-user data ── */
const ME = {
  name: 'Павел Бендин',
  initials: 'ПБ',
  level: 'SENIOR L3',
  email: 'p.bendin@company.com',
  role: 'Staff Engineer',
  department: 'Platform',
  manager: { name: 'Алексей Смирнов', id: 'emp-5' },
  birthday: '12 марта',
  tenure: '4 года 2 мес.',
  phone: '+7 (999) 123-45-67',
  location: 'Москва',
  about:
    'Занимаюсь проектированием и разработкой высоконагруженных платформенных сервисов. Люблю чистую архитектуру, DDD и автоматизацию всего, что можно автоматизировать. Менторю младших инженеров, веду внутренний буткемп по Go.',
  skills: [
    { name: 'Go', level: 'Lead' },
    { name: 'Kubernetes', level: 'Senior' },
    { name: 'PostgreSQL', level: 'Senior' },
    { name: 'gRPC', level: 'Senior' },
    { name: 'Terraform', level: 'Middle' },
    { name: 'React', level: 'Middle' },
  ],
  completionScore: 60,
  completionPoints: 60,
  completionMax: 100,
  completionDone: 4,
  completionTotal: 7,
  vacation: {
    available: 10,
    used: 18,
    total: 28,
    currentYearRemaining: 7,
    carryover: 3,
    workYearStart: '12.03.2025',
    workYearEnd: '11.03.2026',
    next: { start: '23 июня', end: '7 июля' },
  },
  languages: [],
  domains: [],
  education: [],
  archivedProjects: [],
  currentProjects: [
    { name: 'API Gateway', role: 'Lead Engineer', load: 100 },
    { name: 'Интернет-банк 3.0', role: 'Staff Engineer', load: 40 },
  ],
  feedback: [
    { id: 1, from: 'Алексей Смирнов', role: 'Руководитель', date: '20 фев 2026', text: 'Отличная работа над API Gateway. Павел показал высокий уровень архитектурного мышления и умение работать с командой.', type: 'positive' },
    { id: 2, from: 'Мария Козлова', role: 'Product Manager', date: '5 фев 2026', text: 'Павел всегда доступен для обсуждения технических решений. Быстро реагирует на изменения в требованиях.', type: 'positive' },
    { id: 3, from: 'Дмитрий Волков', role: 'DevOps Lead', date: '15 янв 2026', text: 'Код ревью от Павла всегда детальные и конструктивные. Помогает команде расти.', type: 'positive' },
  ],
  idp: [
    { id: 1, goal: 'Получить сертификацию AWS Solutions Architect', status: 'in_progress', deadline: 'Q2 2026', progress: 60 },
    { id: 2, goal: 'Провести 5 менторских сессий по Go', status: 'done', deadline: 'Q1 2026', progress: 100 },
    { id: 3, goal: 'Выступить на внутреннем митапе по gRPC', status: 'planned', deadline: 'Q3 2026', progress: 0 },
    { id: 4, goal: 'Изучить Rust на уровне Middle', status: 'in_progress', deadline: 'Q4 2026', progress: 25 },
  ],
  courses: [
    { id: 1, name: 'AWS Solutions Architect', provider: 'Internal Academy', status: 'in_progress', progress: 60, deadline: 'Июнь 2026' },
    { id: 2, name: 'Advanced Go Patterns', provider: 'Internal Academy', status: 'done', progress: 100, completedDate: 'Дек 2025' },
    { id: 3, name: 'Kubernetes Security', provider: 'External', status: 'planned', progress: 0, deadline: 'Авг 2026' },
  ],
  achievements: [
    { title: 'Mentor of the Year', icon: '🎓', date: '2025' },
    { title: 'Hackathon Winner', icon: '🏆', date: 'Q4 2025' },
    { title: '100 Code Reviews', icon: '✅', date: 'Ноябрь 2025' },
    { title: 'Open Source Hero', icon: '📦', date: '2025' },
  ],
};

const LANGUAGE_OPTIONS = ['Русский', 'Английский', 'Немецкий', 'Французский', 'Испанский', 'Китайский', 'Японский', 'Корейский', 'Итальянский', 'Португальский'];
const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Родной'];

const COMPLETION_ITEMS = [
  { label: 'Основная информация', points: 15, done: true, tab: 'Обзор' },
  { label: 'Контактная информация', points: 10, done: true, tab: 'Обзор' },
  { label: 'Навыки и компетенции', points: 20, done: true, tab: 'Навыки и экспертиза' },
  { label: 'О себе', points: 15, done: true, tab: 'Обзор' },
  { label: 'Проекты', points: 20, done: true, tab: 'Опыт' },
  { label: 'Образование', points: 10, done: false, tab: 'Опыт' },
  { label: 'Языки', points: 10, done: false, tab: 'Навыки и экспертиза' },
];

const TABS = ['Обзор', 'Навыки и экспертиза', 'Активность', 'Опыт', 'ИПР', 'Фидбэки'];

const SKILL_COLORS = {
  Lead: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/40',
  Senior: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/40',
  Middle: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/40',
  Junior: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600/40',
};

// ─── Icons (inline SVGs kept small) ──────────────────────────
const Icon = {
  mail: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  ),
  pin: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  ),
  people: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  share: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
    </svg>
  ),
  check: (
    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
  chevron: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  ),
  close: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),
  calendar: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
};

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState('Обзор');
  const [nudgeVisible, setNudgeVisible] = useState(true);
  const [vacationModalOpen, setVacationModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({ phone: ME.phone, about: ME.about });
  const [editDraft, setEditDraft] = useState({ phone: ME.phone, about: ME.about });

  const startEditing = () => {
    setEditDraft({ phone: profileData.phone, about: profileData.about });
    setEditing(true);
  };
  const cancelEditing = () => setEditing(false);
  const saveEditing = () => {
    setProfileData({ ...editDraft });
    setEditing(false);
  };

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">

      {/* ═══════════════════════════════════════════════════════
           1. HERO HEADER — single identity block
           Combines: avatar, name/role, contact row, bio.
           Actions pinned top-right.
           UX: One glance = "who is this person".
         ═══════════════════════════════════════════════════════ */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Subtle top accent — brand presence without decoration */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400" />

        <div className="p-6 sm:p-8">
          {/* Top row: identity + actions */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg shadow-blue-600/20">
              {ME.initials}
            </div>

            {/* Name block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {ME.name}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[11px] font-bold tracking-widest border border-indigo-100">
                  {ME.level}
                </span>
              </div>

              <p className="text-[15px] text-gray-600 mt-0.5">
                {ME.role} · {ME.department}
              </p>

              {/* Contact row — icons for instant scanning */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-gray-500">
                <ContactChip icon={Icon.mail} href={`mailto:${ME.email}`}>
                  {ME.email}
                </ContactChip>
                <ContactChip icon={Icon.phone} href={editing ? undefined : `tel:${profileData.phone.replace(/\D/g, '')}`}>
                  {profileData.phone}
                </ContactChip>
                <ContactChip icon={Icon.pin}>{ME.location}</ContactChip>
                <ContactChip icon={Icon.people} href="#">
                  {ME.manager.name}
                </ContactChip>
              </div>
            </div>

            {/* Actions — right-aligned on desktop */}
            <div className="flex items-center gap-2 flex-shrink-0 sm:self-start">
              {editing ? (
                <>
                  <button
                    onClick={saveEditing}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="hidden sm:inline">Сохранить</span>
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="h-9 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition shadow-sm"
                  >
                    {Icon.edit}
                    <span className="hidden sm:inline">Редактировать</span>
                  </button>
                  <button
                    className="h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition flex items-center justify-center"
                    title="Поделиться профилем"
                  >
                    {Icon.share}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio + edit fields — inside the identity block for cohesion */}
          <div className="mt-5 border-t border-gray-100 pt-5 max-w-2xl">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Телефон</label>
                  <input
                    type="tel"
                    value={editDraft.phone}
                    onChange={(e) => setEditDraft((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full sm:w-56 h-9 text-sm border border-gray-200 rounded-lg px-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">О себе</label>
                  <textarea
                    value={editDraft.about}
                    onChange={(e) => setEditDraft((d) => ({ ...d, about: e.target.value }))}
                    rows={4}
                    className="w-full text-sm leading-relaxed border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-y"
                  />
                </div>
              </div>
            ) : (
              profileData.about && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {profileData.about}
                </p>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           2. STAT STRIP — key numbers at a glance
           UX: "Dashboard KPI" pattern — user instantly sees
           tenure, vacation balance, profile score, awards.
           Numbers are large; labels are micro.
         ═══════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          value={ME.tenure}
          label="В компании"
          accent="text-gray-900"
        />
        <StatCard
          value={`${ME.vacation.available} дн.`}
          label="Отпуск доступен"
          accent="text-blue-600"
          sub={`из ${ME.vacation.total}`}
        />
        <StatCard
          value={`${ME.completionScore}%`}
          label="Профиль заполнен"
          accent="text-amber-600"
          progress={ME.completionScore}
        />
        <StatCard
          value={ME.achievements.length}
          label="Достижения"
          accent="text-emerald-600"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
           3. COMPLETION NUDGE — slim, contextual, dismissible
           UX: motivates without dominating.  Appears only when
           profile < 100%.  Disappears forever on dismiss.
         ═══════════════════════════════════════════════════════ */}
      {nudgeVisible && ME.completionScore < 100 && (
        <section className="relative flex items-center gap-4 bg-amber-50 rounded-xl px-5 py-3.5">
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-base">💡</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-amber-900">
                Заполните профиль до конца — осталось {ME.completionTotal - ME.completionDone} шага
              </p>
              <p className="text-xs text-amber-700 mt-0.5 hidden sm:block">
                Полный профиль помогает руководителям учитывать ваши навыки при формировании команд
              </p>
            </div>
          </div>
          <button
            onClick={() => setNudgeVisible(false)}
            className="p-1.5 rounded-md text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition flex-shrink-0"
          >
            {Icon.close}
          </button>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
           4. TABS + SIDEBAR — tabs left, vacation & achievements right
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Tabs (3/5) */}
        <section className="lg:col-span-3 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Tab bar */}
          <div className="px-6 pt-4">
            <div className="flex flex-wrap justify-center sm:justify-start gap-0.5 p-0.5 rounded-lg">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
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

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'Обзор' && <OverviewTab onNavigate={setActiveTab} />}
            {activeTab === 'Навыки и экспертиза' && <SkillsTab />}
            {activeTab === 'Активность' && <ActivityTab />}
            {activeTab === 'Опыт' && <ExperienceTab />}
            {activeTab === 'ИПР' && <IDPTab />}
            {activeTab === 'Фидбэки' && <FeedbackTab />}
          </div>
        </section>

        {/* Right — Vacation + Achievements (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Vacation widget */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Отпуск
            </h3>

            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-gray-900">
                  {ME.vacation.available}
                </span>
                <span className="text-sm text-gray-500">
                  из {ME.vacation.total} дн.
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(ME.vacation.used / ME.vacation.total) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] text-gray-500">
              <span>Использовано: {ME.vacation.used} дн.</span>
              <span>Доступно: {ME.vacation.available} дн.</span>
            </div>

            {/* Balance breakdown */}
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Текущий год</span>
                <span className="text-xs font-medium text-gray-700">{ME.vacation.currentYearRemaining} дн.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Перенос</span>
                <span className="text-xs font-medium text-gray-700">{ME.vacation.carryover} дн.</span>
              </div>
            </div>

            {/* Work year dates */}
            <div className="flex items-center gap-2 mt-3 text-[11px] text-gray-500">
              {Icon.calendar}
              <span>{ME.vacation.workYearStart} — {ME.vacation.workYearEnd}</span>
            </div>

            {ME.vacation.next && (
              <div className="flex items-center gap-2.5 mt-4 p-3 rounded-lg bg-blue-50">
                <div className="text-blue-500 flex-shrink-0">{Icon.calendar}</div>
                <div>
                  <p className="text-xs font-medium text-blue-800">Ближайший отпуск</p>
                  <p className="text-xs text-blue-600">
                    {ME.vacation.next.start} — {ME.vacation.next.end}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setVacationModalOpen(true)}
              className="w-full mt-4 h-9 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Запросить отпуск
            </button>
          </div>

          {/* Achievements */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Достижения
              </h3>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {ME.achievements.length}
              </span>
            </div>
            <div className="space-y-2">
              {ME.achievements.map((a) => (
                <div
                  key={a.title}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition -mx-1"
                >
                  <span className="text-xl flex-shrink-0 w-8 text-center">{a.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{a.title}</p>
                    <p className="text-[11px] text-gray-500">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <VacationRequestModal
        open={vacationModalOpen}
        onClose={() => setVacationModalOpen(false)}
        vacationBalance={ME.vacation}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS — each tab's content lives in its own function
   so the main component stays readable.
   ═══════════════════════════════════════════════════════════════ */

/* ── Overview tab: info + completion checklist ── */
function OverviewTab({ onNavigate }) {
  const [checklistOpen, setChecklistOpen] = useState(true);
  const completionPct = Math.round(
    (ME.completionDone / ME.completionTotal) * 100
  );

  return (
    <div className="space-y-6">
      {/* Quick info grid */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Информация
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCell label="Должность" value={ME.role} />
          <InfoCell label="Отдел" value={ME.department} />
          <InfoCell label="Руководитель" value={ME.manager.name} isLink />
          <InfoCell label="День рождения" value={ME.birthday} />
          <InfoCell label="В компании" value={ME.tenure} />
          <InfoCell label="Локация" value={ME.location} />
        </div>
      </div>

      {/* Completion checklist — collapsible */}
      <div>
        <button
          onClick={() => setChecklistOpen((o) => !o)}
          className="flex items-center justify-between w-full group"
        >
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Заполненность профиля
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{completionPct}%</span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                checklistOpen ? 'rotate-90' : ''
              }`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        {/* Progress bar — always visible */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mt-2.5">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        {/* Collapsible list */}
        {checklistOpen && (
          <div className="mt-3 space-y-0.5">
            {COMPLETION_ITEMS.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between py-2 px-2.5 rounded-lg transition ${
                  item.done ? '' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.done ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      {Icon.check}
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      item.done
                        ? 'text-gray-500 line-through decoration-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[11px] text-gray-500">+{item.points}</span>
                </div>
                {!item.done && (
                  <button
                    onClick={() => onNavigate(item.tab)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1 py-1 px-2.5 rounded-md hover:bg-blue-50"
                  >
                    Заполнить
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Skills tab ── */
function SkillsTab() {
  const [languages, setLanguages] = useState(ME.languages);
  const [newLang, setNewLang] = useState('');
  const [newLevel, setNewLevel] = useState('B1');

  const addLanguage = () => {
    if (!newLang) return;
    if (languages.some((l) => l.name === newLang)) return;
    setLanguages((prev) => [...prev, { name: newLang, level: newLevel }]);
    setNewLang('');
    setNewLevel('B1');
  };

  const removeLanguage = (name) => {
    setLanguages((prev) => prev.filter((l) => l.name !== name));
  };

  return (
    <div className="space-y-8">
      {/* Skills */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Навыки и компетенции
        </h3>
        <div className="flex flex-wrap gap-2">
          {ME.skills.map((s) => (
            <span
              key={s.name}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                SKILL_COLORS[s.level] || 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600/40'
              }`}
            >
              {s.name}
              <span className="text-[10px] opacity-60 font-normal">{s.level}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Языки
        </h3>

        {languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {languages.map((l) => (
              <span
                key={l.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-gray-700"
              >
                {l.name}
                <span className="text-[10px] opacity-60 font-normal">{l.level}</span>
                <button
                  onClick={() => removeLanguage(l.name)}
                  className="ml-0.5 text-gray-500 hover:text-red-500 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add language form */}
        <div className="flex items-end gap-3">
          <div className="flex-1 max-w-[200px]">
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Язык</label>
            <CustomSelect
              value={newLang}
              onChange={(v) => setNewLang(v)}
              options={LANGUAGE_OPTIONS.filter((l) => !languages.some((x) => x.name === l))}
              placeholder="Выберите язык"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Уровень</label>
            <CustomSelect
              value={newLevel}
              onChange={(v) => setNewLevel(v)}
              options={LANGUAGE_LEVELS}
            />
          </div>
          <button
            onClick={addLanguage}
            className="h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition shadow-sm"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Experience tab: current projects, education, archived projects ── */
function ExperienceTab() {
  const [edu, setEdu] = useState(ME.education);
  const [projects, setProjects] = useState(ME.archivedProjects);

  // Education form
  const emptyEdu = { institution: '', specialty: '', degree: '', endYear: '' };
  const [eduForm, setEduForm] = useState(emptyEdu);
  const [eduFormOpen, setEduFormOpen] = useState(false);
  const [editingEduIdx, setEditingEduIdx] = useState(null);

  // Project form
  const emptyProj = { name: '', role: '', period: '', description: '' };
  const [projForm, setProjForm] = useState(emptyProj);
  const [projFormOpen, setProjFormOpen] = useState(false);
  const [editingProjIdx, setEditingProjIdx] = useState(null);

  // ── Education CRUD ──
  const openAddEdu = () => { setEduForm(emptyEdu); setEditingEduIdx(null); setEduFormOpen(true); };
  const openEditEdu = (idx) => { setEduForm({ ...edu[idx] }); setEditingEduIdx(idx); setEduFormOpen(true); };
  const saveEdu = () => {
    if (!eduForm.institution.trim()) return;
    if (editingEduIdx !== null) {
      setEdu((prev) => prev.map((e, i) => (i === editingEduIdx ? { ...eduForm } : e)));
    } else {
      setEdu((prev) => [...prev, { ...eduForm }]);
    }
    setEduForm(emptyEdu); setEduFormOpen(false); setEditingEduIdx(null);
  };
  const removeEdu = (idx) => setEdu((prev) => prev.filter((_, i) => i !== idx));
  const cancelEdu = () => { setEduFormOpen(false); setEditingEduIdx(null); };

  // ── Project CRUD ──
  const openAddProj = () => { setProjForm(emptyProj); setEditingProjIdx(null); setProjFormOpen(true); };
  const openEditProj = (idx) => { setProjForm({ ...projects[idx] }); setEditingProjIdx(idx); setProjFormOpen(true); };
  const saveProj = () => {
    if (!projForm.name.trim()) return;
    if (editingProjIdx !== null) {
      setProjects((prev) => prev.map((p, i) => (i === editingProjIdx ? { ...projForm } : p)));
    } else {
      setProjects((prev) => [...prev, { ...projForm }]);
    }
    setProjForm(emptyProj); setProjFormOpen(false); setEditingProjIdx(null);
  };
  const removeProj = (idx) => setProjects((prev) => prev.filter((_, i) => i !== idx));
  const cancelProj = () => { setProjFormOpen(false); setEditingProjIdx(null); };

  const inputCls = 'w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20';

  const editBtn = (onClick) => (
    <button onClick={onClick} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition" title="Редактировать">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
      </svg>
    </button>
  );
  const deleteBtn = (onClick) => (
    <button onClick={onClick} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition" title="Удалить">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    </button>
  );
  const addBtnInline = (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );

  return (
    <div className="space-y-8">
      {/* ── Current Projects ── */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Текущие проекты
        </h3>
        {ME.currentProjects.length > 0 ? (
          <div className="space-y-3">
            {ME.currentProjects.map((proj) => (
              <div key={proj.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{proj.name}</p>
                  <p className="text-xs text-gray-500">{proj.role}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${proj.load}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-600 tabular-nums">{proj.load}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Нет активных проектов.</p>
        )}
      </div>

      {/* ── Education ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Образование
          </h3>
          {!eduFormOpen && (
            <button onClick={openAddEdu} className="text-xs font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
              {addBtnInline} Добавить
            </button>
          )}
        </div>

        {edu.length > 0 && (
          <div className="space-y-3 mb-4">
            {edu.map((item, idx) => (
              <div key={idx} className="group flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{item.institution}</p>
                  {item.specialty && <p className="text-sm text-gray-500">{item.specialty}</p>}
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.degree}{item.endYear ? `, ${item.endYear}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editBtn(() => openEditEdu(idx))}
                  {deleteBtn(() => removeEdu(idx))}
                </div>
              </div>
            ))}
          </div>
        )}

        {eduFormOpen && (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Учебное заведение *</label>
              <input type="text" value={eduForm.institution} onChange={(e) => setEduForm((f) => ({ ...f, institution: e.target.value }))} placeholder="Название вуза / колледжа" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Специальность</label>
                <input type="text" value={eduForm.specialty} onChange={(e) => setEduForm((f) => ({ ...f, specialty: e.target.value }))} placeholder="Направление" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Степень</label>
                <CustomSelect
                  value={eduForm.degree}
                  onChange={(v) => setEduForm((f) => ({ ...f, degree: v }))}
                  options={[
                    { value: 'Бакалавр', label: 'Бакалавр' },
                    { value: 'Магистр', label: 'Магистр' },
                    { value: 'Специалист', label: 'Специалист' },
                    { value: 'Аспирантура', label: 'Аспирантура' },
                    { value: 'MBA', label: 'MBA' },
                    { value: 'Среднее специальное', label: 'Среднее специальное' },
                  ]}
                  placeholder="Выберите"
                />
              </div>
            </div>
            <div className="max-w-[200px]">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Год окончания</label>
              <input type="number" value={eduForm.endYear} onChange={(e) => setEduForm((f) => ({ ...f, endYear: e.target.value }))} placeholder="2020" min="1970" max="2030" className={inputCls} />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button onClick={saveEdu} className="h-8 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition shadow-sm">
                {editingEduIdx !== null ? 'Сохранить' : 'Добавить'}
              </button>
              <button onClick={cancelEdu} className="h-8 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Отмена</button>
            </div>
          </div>
        )}

        {edu.length === 0 && !eduFormOpen && (
          <p className="text-sm text-gray-500">Нет записей. Добавьте своё образование.</p>
        )}
      </div>

      {/* ── Internal Courses ── */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Курсы и обучение
        </h3>
        {ME.courses.length > 0 ? (
          <div className="space-y-3">
            {ME.courses.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  c.status === 'done' ? 'bg-emerald-50' : c.status === 'in_progress' ? 'bg-blue-50' : 'bg-gray-50'
                }`}>
                  {c.status === 'done' ? (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.provider} · {c.status === 'done' ? c.completedDate : c.deadline}</p>
                </div>
                {c.status === 'in_progress' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 tabular-nums">{c.progress}%</span>
                  </div>
                )}
                {c.status === 'done' && (
                  <span className="text-xs font-medium text-emerald-600">Завершён</span>
                )}
                {c.status === 'planned' && (
                  <span className="text-xs font-medium text-gray-400">Запланирован</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Нет курсов.</p>
        )}
      </div>

      {/* ── Archived Projects ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Архивные проекты
          </h3>
          {!projFormOpen && (
            <button onClick={openAddProj} className="text-xs font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
              {addBtnInline} Добавить
            </button>
          )}
        </div>

        {projects.length > 0 && (
          <div className="space-y-3 mb-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="group flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{proj.name}</p>
                  {proj.role && <p className="text-sm text-gray-500">{proj.role}</p>}
                  <p className="text-xs text-gray-500 mt-0.5">
                    {proj.period}
                  </p>
                  {proj.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{proj.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editBtn(() => openEditProj(idx))}
                  {deleteBtn(() => removeProj(idx))}
                </div>
              </div>
            ))}
          </div>
        )}

        {projFormOpen && (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Название проекта *</label>
                <input type="text" value={projForm.name} onChange={(e) => setProjForm((f) => ({ ...f, name: e.target.value }))} placeholder="Platform v2" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Роль</label>
                <input type="text" value={projForm.role} onChange={(e) => setProjForm((f) => ({ ...f, role: e.target.value }))} placeholder="Tech Lead" className={inputCls} />
              </div>
            </div>
            <div className="max-w-[200px]">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Период</label>
              <input type="text" value={projForm.period} onChange={(e) => setProjForm((f) => ({ ...f, period: e.target.value }))} placeholder="2023 — 2024" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Описание</label>
              <textarea value={projForm.description} onChange={(e) => setProjForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Краткое описание проекта и достижений..." className={`${inputCls} h-auto py-2 resize-y`} />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button onClick={saveProj} className="h-8 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition shadow-sm">
                {editingProjIdx !== null ? 'Сохранить' : 'Добавить'}
              </button>
              <button onClick={cancelProj} className="h-8 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Отмена</button>
            </div>
          </div>
        )}

        {projects.length === 0 && !projFormOpen && (
          <p className="text-sm text-gray-500">Нет записей. Добавьте завершённые проекты.</p>
        )}
      </div>
    </div>
  );
}

/* ── IDP tab: Individual Development Plan ── */
const IDP_STATUS_STYLES = {
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  planned: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
};
const IDP_STATUS_LABELS = { done: 'Выполнено', in_progress: 'В процессе', planned: 'Запланировано' };

function IDPTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Индивидуальный план развития
        </h3>
        <span className="text-xs text-gray-400">{ME.idp.filter(g => g.status === 'done').length} из {ME.idp.length} целей</span>
      </div>
      {ME.idp.map((goal) => (
        <div key={goal.id} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{goal.goal}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Дедлайн: {goal.deadline}</p>
            </div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${IDP_STATUS_STYLES[goal.status]}`}>
              {IDP_STATUS_LABELS[goal.status]}
            </span>
          </div>
          {goal.status !== 'planned' && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${goal.status === 'done' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500 tabular-nums">{goal.progress}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Feedback tab ── */
function FeedbackTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Обратная связь
      </h3>
      {ME.feedback.map((fb) => (
        <div key={fb.id} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {fb.from.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{fb.from}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{fb.role}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{fb.date}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{fb.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Activity tab ── */
const ACTIVITY_ITEMS = [
  {
    id: 1,
    type: 'project',
    title: 'Назначен на проект API Gateway',
    description: 'Роль: Lead Engineer · Загрузка 100%',
    date: '28 фев 2026',
    icon: 'project',
  },
  {
    id: 2,
    type: 'review',
    title: 'Code review: авторизация через OAuth2',
    description: 'Репозиторий platform-auth · 12 комментариев',
    date: '25 фев 2026',
    icon: 'review',
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Получена награда «100 Code Reviews»',
    description: 'За вклад в качество кода команды',
    date: '20 фев 2026',
    icon: 'achievement',
  },
  {
    id: 4,
    type: 'skill',
    title: 'Обновлён навык: Kubernetes → Senior',
    description: 'Подтверждено руководителем',
    date: '14 фев 2026',
    icon: 'skill',
  },
  {
    id: 5,
    type: 'vacation',
    title: 'Запрос на отпуск одобрен',
    description: '23 июня – 7 июля · 14 календарных дней',
    date: '10 фев 2026',
    icon: 'vacation',
  },
  {
    id: 6,
    type: 'review',
    title: 'Code review: миграция на gRPC v2',
    description: 'Репозиторий platform-core · 8 комментариев',
    date: '5 фев 2026',
    icon: 'review',
  },
  {
    id: 7,
    type: 'mentor',
    title: 'Менторская сессия с Алексеевым А. А.',
    description: 'Тема: архитектура микросервисов',
    date: '1 фев 2026',
    icon: 'mentor',
  },
  {
    id: 8,
    type: 'project',
    title: 'Завершён проект СИФР',
    description: 'Длительность: 8 мес. · Роль: Senior Engineer',
    date: '25 янв 2026',
    icon: 'project',
  },
  {
    id: 9,
    type: 'achievement',
    title: 'Получена награда «Mentor of the Year»',
    description: 'По итогам 2025 года',
    date: '15 янв 2026',
    icon: 'achievement',
  },
  {
    id: 10,
    type: 'review',
    title: 'Code review: rate limiter для API Gateway',
    description: 'Репозиторий api-gateway · 5 комментариев',
    date: '10 янв 2026',
    icon: 'review',
  },
];

const ACTIVITY_ICON_STYLES = {
  project: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  review: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  achievement: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  skill: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  vacation: 'bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400',
  mentor: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
};

const ACTIVITY_ICONS = {
  project: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  ),
  review: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  ),
  achievement: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-5.624a6.023 6.023 0 0 0-2.77.896" />
    </svg>
  ),
  skill: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  vacation: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  ),
  mentor: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  ),
};

function ActivityTab() {
  return (
    <div className="space-y-0.5">
      {ACTIVITY_ITEMS.map((item) => (
        <div key={item.id} className="flex gap-3.5 py-2.5 px-1 rounded-lg hover:bg-gray-50/60 dark:hover:bg-gray-700/20 transition-colors">
          <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 ${ACTIVITY_ICON_STYLES[item.icon]}`}>
            {ACTIVITY_ICONS[item.icon]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.description}
            </p>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0 pt-0.5">
            {item.date}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Empty tab placeholder ── */
function EmptyTab({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xs text-gray-500 mt-1">Раздел в разработке</p>
    </div>
  );
}

/* ── Custom Select — themed dropdown ── */
function CustomSelect({ value, onChange, options, placeholder, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => (typeof o === 'string' ? o : o.value) === value);
  const label = selected ? (typeof selected === 'string' ? selected : selected.label) : null;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-600
                   text-sm text-left outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20
                   flex items-center justify-between gap-2 transition
                   text-gray-900 dark:text-gray-100 select-trigger"
      >
        <span className={label ? '' : 'text-gray-400 dark:text-gray-500'}>{label || placeholder || 'Выберите'}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-600
                        shadow-lg dark:shadow-black/40 py-1 select-dropdown">
          {placeholder && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-50 transition"
            >
              {placeholder}
            </button>
          )}
          {options.map((opt) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            const isSelected = optValue === value;
            return (
              <button
                key={optValue}
                type="button"
                onClick={() => { onChange(optValue); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition flex items-center justify-between
                  ${isSelected
                    ? 'bg-blue-50 text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50'
                  }`}
              >
                {optLabel}
                {isSelected && (
                  <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Shared micro-components ── */

function ContactChip({ icon, href, children }) {
  const Wrapper = href ? 'a' : 'span';
  return (
    <Wrapper
      href={href}
      className={`inline-flex items-center gap-1.5 ${
        href ? 'text-blue-600 hover:text-blue-700 transition' : 'text-gray-500'
      }`}
    >
      <span className="text-gray-500">{icon}</span>
      {children}
    </Wrapper>
  );
}

function StatCard({ value, label, accent, sub, progress }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <div className="flex items-baseline gap-1.5">
        <span className={`text-xl font-bold ${accent}`}>{value}</span>
        {sub && <span className="text-xs text-gray-500">{sub}</span>}
      </div>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {progress != null && (
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, value, isLink }) {
  return (
    <div>
      <p className="text-[11px] text-gray-500 mb-0.5">{label}</p>
      {isLink ? (
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition">
          {value}
        </a>
      ) : (
        <p className="text-sm text-gray-800">{value}</p>
      )}
    </div>
  );
}

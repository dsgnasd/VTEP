import { useState } from 'react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Tabs from '../components/ui/Tabs';

/* ── Temporary seed data ── */
const CURRENT_PROJECTS = [
  {
    id: 1,
    name: 'Интернет-банк 3.0',
    description: 'Полный редизайн и миграция интернет-банка на микросервисную архитектуру',
    team: 14,
    startDate: 'Янв 2025',
    deadline: 'Дек 2025',
    techStack: ['React', 'Go', 'PostgreSQL', 'Kafka'],
    lead: 'Алексей Борщёв',
  },
  {
    id: 2,
    name: 'API Gateway',
    description: 'Единая точка входа для всех внешних и внутренних API сервисов',
    team: 6,
    startDate: 'Мар 2025',
    deadline: 'Сен 2025',
    techStack: ['Go', 'gRPC', 'Redis', 'Kubernetes'],
    lead: 'Павел Пирожков',
  },
  {
    id: 3,
    name: 'Мобильный банк',
    description: 'Нативное приложение для iOS и Android с биометрией и push-уведомлениями',
    team: 10,
    startDate: 'Окт 2024',
    deadline: 'Июн 2025',
    techStack: ['Swift', 'Kotlin', 'Firebase', 'REST'],
    lead: 'Мария Ватрушкина',
  },
  {
    id: 4,
    name: 'Дизайн-система',
    description: 'Библиотека UI-компонентов и токенов для единого визуального стиля',
    team: 4,
    startDate: 'Фев 2025',
    deadline: 'Авг 2025',
    techStack: ['React', 'Figma', 'Storybook', 'TypeScript'],
    lead: 'Анна Тефтелева',
  },
  {
    id: 5,
    name: 'CI/CD Pipeline',
    description: 'Автоматизация сборки, тестирования и деплоя всех сервисов',
    team: 3,
    startDate: 'Ноя 2024',
    deadline: 'Апр 2025',
    techStack: ['GitLab CI', 'Docker', 'Kubernetes', 'Terraform'],
    lead: 'Дмитрий Крокодилов',
  },
  {
    id: 6,
    name: 'Единый кабинет клиента',
    description: 'Портал самообслуживания с личным кабинетом и аналитикой для клиентов',
    team: 8,
    startDate: 'Мар 2025',
    deadline: 'Фев 2026',
    techStack: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
    lead: 'Елена Пингвинова',
  },
];

const ARCHIVED_PROJECTS = [
  {
    id: 101,
    name: 'КХД (Корпоративное хранилище данных)',
    description: 'Централизованное хранилище данных для аналитики и отчётности',
    team: 9,
    startDate: 'Мар 2023',
    endDate: 'Дек 2024',
    techStack: ['Informatica', 'Oracle', 'Power BI', 'ETL'],
    lead: 'Сергей Самоваров',
    result: 'Внедрено, обслуживает 12 отделов',
  },
  {
    id: 102,
    name: 'СИФР',
    description: 'Система информационной финансовой отчётности для регулятора',
    team: 7,
    startDate: 'Июн 2023',
    endDate: 'Авг 2024',
    techStack: ['.NET', 'MSSQL', 'Angular', 'SOAP'],
    lead: 'Ольга Шашлыкова',
    result: 'Сдан в продакшен, соответствует требованиям ЦБ',
  },
  {
    id: 103,
    name: 'BPM/Pega Platform',
    description: 'Автоматизация бизнес-процессов на платформе Pega',
    team: 11,
    startDate: 'Янв 2022',
    endDate: 'Май 2024',
    techStack: ['Pega', 'Java', 'BPMN', 'Camunda'],
    lead: 'Игорь Хомяков',
    result: 'Автоматизировано 45 бизнес-процессов',
  },
  {
    id: 104,
    name: 'ITSM/Мониторинг',
    description: 'Система мониторинга инфраструктуры и управления инцидентами',
    team: 5,
    startDate: 'Сен 2023',
    endDate: 'Мар 2024',
    techStack: ['Zabbix', 'Grafana', 'ELK', 'Prometheus'],
    lead: 'Андрей Компотов',
    result: 'Покрытие мониторингом 98% инфраструктуры',
  },
  {
    id: 105,
    name: 'Кредитный конвейер',
    description: 'Автоматизация процесса выдачи кредитов от заявки до решения',
    team: 12,
    startDate: 'Апр 2024',
    endDate: 'Окт 2024',
    techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka'],
    lead: 'Виктор Бегемотов',
    result: 'Приостановлен из-за смены регуляторных требований',
  },
];

const TABS = ['Текущие', 'Архивные'];

/* ── Icons ── */
const Icons = {
  team: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  ),
  calendar: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  lead: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
    </svg>
  ),
  check: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
};

/* ── Project Card (current) ── */
function CurrentCard({ project }) {
  return (
    <Card className="hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 group" hoverable>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition leading-tight mb-3">
        {project.name}
      </h3>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack.map((t) => (
          <span key={t} className="text-[11px] font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded px-1.5 py-0.5">
            {t}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          {Icons.lead}
          <span>{project.lead}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {Icons.team}
          <span>{project.team} чел.</span>
        </div>
        <div className="flex items-center gap-1.5">
          {Icons.calendar}
          <span>{project.startDate} — {project.deadline}</span>
        </div>
      </div>
    </Card>
  );
}

/* ── Project Card (archived) ── */
function ArchivedCard({ project }) {
  return (
    <Card className="opacity-80 hover:opacity-100" hoverable>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight mb-3">
        {project.name}
      </h3>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack.map((t) => (
          <span key={t} className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">
            {t}
          </span>
        ))}
      </div>

      {/* Result */}
      <div className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2 mb-3">
        {Icons.check}
        <span>{project.result}</span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          {Icons.lead}
          <span>{project.lead}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {Icons.team}
          <span>{project.team} чел.</span>
        </div>
        <div className="flex items-center gap-1.5">
          {Icons.calendar}
          <span>{project.startDate} — {project.endDate}</span>
        </div>
      </div>
    </Card>
  );
}

/* ── Page ── */
export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('Текущие');

  return (
    <div className="ui-page-stack">
      {/* Header */}
      <PageHeader
        title="Проекты"
        description="Каталог проектов компании и распределение ресурсов"
      />

      {/* Tabs */}
      <Tabs
        tabs={TABS.map((tab) => ({
          value: tab,
          label: tab,
          meta: tab === 'Текущие' ? CURRENT_PROJECTS.length : ARCHIVED_PROJECTS.length,
        }))}
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* Grid */}
      <div className="grid ui-grid-gap grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {activeTab === 'Текущие' &&
          CURRENT_PROJECTS.map((p) => <CurrentCard key={p.id} project={p} />)}
        {activeTab === 'Архивные' &&
          ARCHIVED_PROJECTS.map((p) => <ArchivedCard key={p.id} project={p} />)}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// ProjectsPage — project catalogue / portfolio view.
// Content TBD — renders an empty-state shell for now.
// ──────────────────────────────────────────────────────────────

import { projects } from '../data/mockData';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Проекты</h1>
        <p className="mt-1 text-sm text-gray-500">
          Каталог проектов компании и распределение ресурсов
        </p>
      </div>

      {/* Project cards grid — shells only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-gray-300 transition group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                Активный
              </span>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">
              {project.name}
            </h3>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H5.228A2 2 0 0 1 3.24 17.5a4.125 4.125 0 0 1 7.533-2.493M15 19.128a9.38 9.38 0 0 1-2.625.372A9.337 9.337 0 0 1 3.24 17.5" />
                </svg>
                <span>—</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <span>—</span>
              </div>
            </div>

            <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-200 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

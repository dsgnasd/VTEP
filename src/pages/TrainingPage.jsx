// ──────────────────────────────────────────────────────────────
// TrainingPage — learning & development hub.
// Content TBD — renders an empty-state shell for now.
// ──────────────────────────────────────────────────────────────

export default function TrainingPage() {
  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Обучение</h1>
        <p className="mt-1 text-sm text-gray-500">
          Курсы, сертификации и развитие навыков
        </p>
      </div>

      {/* Category cards — shells */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: 'Курсы',
            description: 'Внутренние и внешние программы обучения',
            icon: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
            color: 'from-blue-500 to-indigo-600',
          },
          {
            title: 'Сертификации',
            description: 'Профессиональные сертификаты и экзамены',
            icon: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5',
            color: 'from-emerald-500 to-teal-600',
          },
          {
            title: 'Менторинг',
            description: 'Программы наставничества и код-ревью',
            icon: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
            color: 'from-amber-500 to-orange-600',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm hover:border-gray-300 transition group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-sm`}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">
              {card.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{card.description}</p>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Раздел в разработке</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content placeholder */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">Каталог обучения</p>
          <p className="text-xs text-gray-500 mt-1.5">
            Здесь будет доступен каталог курсов, прогресс обучения и рекомендации
          </p>
        </div>
      </div>
    </div>
  );
}

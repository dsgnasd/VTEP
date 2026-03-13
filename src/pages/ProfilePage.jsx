import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { employees } from '../data/mockData';
import EmployeeProfile from '../components/profile/EmployeeProfile';

// ──────────────────────────────────────────────────────────────
// ProfilePage — страница профиля конкретного сотрудника.
// ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { id } = useParams();

  const employee = useMemo(
    () => employees.find((e) => e.id === id),
    [id]
  );

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Сотрудник не найден.</p>
        <Link
          to="/registry"
          className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Вернуться в реестр
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Хлебные крошки */}
      <nav className="mb-4 text-sm">
        <Link to="/registry" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
          Сотрудники
        </Link>
        <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{employee.name}</span>
      </nav>

      <EmployeeProfile employee={employee} />
    </div>
  );
}

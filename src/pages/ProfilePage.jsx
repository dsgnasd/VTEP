import { useParams, Link } from 'react-router-dom';
import EmployeeProfile from '../components/profile/EmployeeProfile';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import useEmployeeProfile from '../hooks/useEmployeeProfile';

// ──────────────────────────────────────────────────────────────
// ProfilePage — страница профиля конкретного сотрудника.
// ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { id } = useParams();
  const { employee, loading, error } = useEmployeeProfile(id);

  if (loading) {
    return (
      <Card padding="lg" className="min-h-[320px] flex items-center justify-center">
        <EmptyState
          title="Загружаем профиль сотрудника"
          description="Подготавливаем данные профиля"
          className="max-w-sm"
        />
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding="lg" className="min-h-[320px] flex items-center justify-center">
        <EmptyState
          title="Не удалось загрузить профиль"
          description="Источник данных временно недоступен"
          action={(
            <Button as={Link} to="/registry" variant="secondary">
              Вернуться в реестр
            </Button>
          )}
          className="max-w-sm"
        />
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card padding="lg" className="min-h-[320px] flex items-center justify-center">
        <EmptyState
          title="Сотрудник не найден"
          description="Проверьте ссылку или вернитесь в реестр"
          action={(
            <Button as={Link} to="/registry" variant="secondary">
              Вернуться в реестр
            </Button>
          )}
          className="max-w-sm"
        />
      </Card>
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

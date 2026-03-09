import { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import StatusBadge from '../shared/StatusBadge';
import useTeams from '../../hooks/useTeams';

// ──────────────────────────────────────────────────────────────
// TeamsView — manage custom employee teams.
// Props: employees (full list from mockData)
// ──────────────────────────────────────────────────────────────

function shortName(full) {
  const parts = full.split(' ');
  if (parts.length <= 1) return full;
  return parts[0] + ' ' + parts.slice(1).map((p) => p[0] + '.').join(' ');
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

/* ── Team Modal (create / edit) ── */

function TeamModal({ open, onClose, onSave, employees, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [selected, setSelected] = useState(() => new Set(initial?.memberIds || []));
  const [search, setSearch] = useState('');

  const toggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter((e) => e.name.toLowerCase().includes(q));
  }, [employees, search]);

  // Sort: selected first
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aS = selected.has(a.id) ? 0 : 1;
      const bS = selected.has(b.id) ? 0 : 1;
      return aS - bS;
    });
  }, [filtered, selected]);

  const handleSave = () => {
    if (!name.trim() || selected.size === 0) return;
    onSave(name.trim(), [...selected]);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
        style={{ animation: 'modalIn 200ms ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? 'Редактировать команду' : 'Новая команда'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Backend Core Team"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Search */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Участники <span className="text-gray-400 font-normal">({selected.size})</span>
            </label>
            <div className="relative">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск сотрудников..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Employee list */}
          <div className="max-h-[300px] overflow-y-auto -mx-2 px-2 space-y-0.5">
            {sorted.map((emp) => {
              const checked = selected.has(emp.id);
              return (
                <label
                  key={emp.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    checked ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(emp.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-medium text-gray-600">{initials(emp.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.role} · {emp.team}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || selected.size === 0}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {initial ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ── Team Detail View ── */

function TeamDetail({ team, employees, onBack, onUpdate, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const members = useMemo(
    () => team.memberIds.map((id) => employees.find((e) => e.id === id)).filter(Boolean),
    [team.memberIds, employees]
  );

  const avgLoad = members.length
    ? Math.round(members.reduce((s, m) => s + m.totalAllocation, 0) / members.length)
    : 0;

  const upcomingVacations = members.filter((m) =>
    m.vacation?.some((v) => new Date(v.endDate) >= new Date())
  ).length;

  const removeMember = (id) => {
    onUpdate(team.id, { memberIds: team.memberIds.filter((mid) => mid !== id) });
  };

  const handleAddMembers = (_name, ids) => {
    const merged = [...new Set([...team.memberIds, ...ids])];
    onUpdate(team.id, { memberIds: merged });
  };

  return (
    <div className="space-y-5">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900 flex-1">{team.name}</h2>
        <button
          onClick={() => { if (window.confirm(`Удалить команду «${team.name}»?`)) { onDelete(team.id); onBack(); } }}
          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
          title="Удалить команду"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <p className="text-2xl font-bold text-gray-900">{members.length}</p>
          <p className="text-sm text-gray-500 mt-1">Участников</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <p className={`text-2xl font-bold ${avgLoad > 100 ? 'text-red-600' : 'text-gray-900'}`}>{avgLoad}%</p>
          <p className="text-sm text-gray-500 mt-1">Средняя загрузка</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <p className="text-2xl font-bold text-gray-900">{upcomingVacations}</p>
          <p className="text-sm text-gray-500 mt-1">В отпуске / планируют</p>
        </div>
      </div>

      {/* Members table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Состав команды</h3>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Добавить
          </button>
        </div>

        {members.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            В команде пока нет участников
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {members.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">{initials(emp.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{shortName(emp.name)}</p>
                  <p className="text-xs text-gray-500">{emp.role} · {emp.team}</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <div className="w-20">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-gray-500">{emp.totalAllocation}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${emp.totalAllocation > 100 ? 'bg-red-500' : emp.totalAllocation >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(emp.totalAllocation, 100)}%` }}
                      />
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>
                <button
                  onClick={() => removeMember(emp.id)}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                  title="Убрать из команды"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <TeamModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddMembers}
        employees={employees.filter((e) => !team.memberIds.includes(e.id))}
        initial={null}
      />
    </div>
  );
}

/* ── Team Card ── */

function TeamCard({ team, employees, onOpen, onEdit, onDelete }) {
  const members = useMemo(
    () => team.memberIds.map((id) => employees.find((e) => e.id === id)).filter(Boolean),
    [team.memberIds, employees]
  );

  const avgLoad = members.length
    ? Math.round(members.reduce((s, m) => s + m.totalAllocation, 0) / members.length)
    : 0;

  const nextVacation = members
    .flatMap((m) => (m.vacation || []).map((v) => ({ ...v, empName: shortName(m.name) })))
    .filter((v) => new Date(v.endDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">{team.name}</h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Редактировать">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
          </button>
          <button
            onClick={() => { if (window.confirm(`Удалить команду «${team.name}»?`)) onDelete(); }}
            className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            title="Удалить"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Avatars */}
      <div className="flex items-center -space-x-2 mb-3">
        {members.slice(0, 5).map((m) => (
          <div key={m.id} className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center" title={m.name}>
            <span className="text-[9px] font-medium text-gray-600">{initials(m.name)}</span>
          </div>
        ))}
        {members.length > 5 && (
          <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
            <span className="text-[9px] font-medium text-gray-500">+{members.length - 5}</span>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{members.length} участников</span>
          <span className={`font-medium ${avgLoad > 100 ? 'text-red-600' : 'text-gray-700'}`}>{avgLoad}% загрузка</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${avgLoad > 100 ? 'bg-red-500' : avgLoad >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ width: `${Math.min(avgLoad, 100)}%` }}
          />
        </div>
        {nextVacation && (
          <p className="text-xs text-gray-500 truncate">
            Отпуск: {nextVacation.empName}, {new Date(nextVacation.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
          </p>
        )}
      </div>

      {/* Open button */}
      <button
        onClick={onOpen}
        className="mt-4 w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        Открыть
      </button>
    </div>
  );
}

/* ── Main TeamsView ── */

export default function TeamsView({ employees }) {
  const { teams, createTeam, updateTeam, deleteTeam } = useTeams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeam, setEditTeam] = useState(null); // team object for editing
  const [detailTeamId, setDetailTeamId] = useState(null);

  const detailTeam = teams.find((t) => t.id === detailTeamId);

  const handleSave = (name, memberIds) => {
    if (editTeam) {
      updateTeam(editTeam.id, { name, memberIds });
    } else {
      createTeam(name, memberIds);
    }
    setEditTeam(null);
  };

  const openEdit = (team) => {
    setEditTeam(team);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTeam(null);
  };

  // Detail view
  if (detailTeam) {
    return (
      <TeamDetail
        team={detailTeam}
        employees={employees}
        onBack={() => setDetailTeamId(null)}
        onUpdate={updateTeam}
        onDelete={(id) => { deleteTeam(id); setDetailTeamId(null); }}
      />
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{teams.length ? `${teams.length} команд` : 'Команд пока нет'}</p>
        <button
          onClick={() => { setEditTeam(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Создать команду
        </button>
      </div>

      {/* Cards or empty state */}
      {teams.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Создайте первую команду</p>
            <p className="text-xs text-gray-500 mt-1.5">
              Группируйте сотрудников для быстрого просмотра загрузки и отпусков
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              employees={employees}
              onOpen={() => setDetailTeamId(team.id)}
              onEdit={() => openEdit(team)}
              onDelete={() => deleteTeam(team.id)}
            />
          ))}
        </div>
      )}

      <TeamModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        employees={employees}
        initial={editTeam}
      />
    </div>
  );
}

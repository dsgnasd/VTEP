import { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import StatusBadge from '../shared/StatusBadge';
import useTeams from '../../hooks/useTeams';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Field from '../ui/Field';
import Input from '../ui/Input';

// ──────────────────────────────────────────────────────────────
// TeamsView — manage custom employee teams.
// Props: employees (full list from seed data source)
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

/* ── Confirm Modal ── */

function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Удалить', danger }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative ui-card max-w-sm w-full p-6 space-y-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {message && <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose} variant="secondary">
            Отмена
          </Button>
          <Button
            onClick={() => { onConfirm(); onClose(); }}
            className={danger ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Team Modal (create / edit) ── */

export function TeamModal({ open, onClose, onSave, employees, initial, addOnly }) {
  const [name, setName] = useState(initial?.name || '');
  const [selected, setSelected] = useState(() => new Set(initial?.memberIds || []));
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState(initial?.visibility || 'public');

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
    onSave(name.trim(), [...selected], visibility);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="ui-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
        style={{ animation: 'modalIn 200ms ease-out' }}
      >
        {/* Header */}
        <div className="ui-card-header border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {addOnly ? 'Добавить участников' : initial ? 'Редактировать команду' : 'Новая команда'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="ui-card-body ui-form-stack overflow-y-auto flex-1 min-h-0">
          {/* Name */}
          {addOnly ? (
            <div>
              <label className="ui-field-label text-sm">Команда</label>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium px-3 py-2.5">{name}</p>
            </div>
          ) : (
            <Field label="Название">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Backend Core Team"
                className="h-10 dark:bg-gray-700"
                autoFocus
              />
            </Field>
          )}

          {/* Visibility toggle */}
          {!addOnly && (
            <div>
              <label className="ui-field-label text-sm">Видимость</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    visibility === 'public'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium leading-tight">Публичная</p>
                    <p className={`text-xs leading-tight ${visibility === 'public' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>Участники видят</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    visibility === 'private'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium leading-tight">Частная</p>
                    <p className={`text-xs leading-tight ${visibility === 'private' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>Только вы видите</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div>
            <label className="ui-field-label text-sm">
              Участники <span className="text-gray-400 font-normal">({selected.size})</span>
            </label>
            <div className="relative">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск сотрудников..."
                className="h-10 pl-9 pr-3 dark:bg-gray-700"
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
                    checked ? 'bg-blue-50 dark:bg-blue-500/15' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(emp.id)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{initials(emp.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{emp.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{emp.role} · {emp.team}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="ui-card-footer border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
          <Button onClick={onClose} variant="ghost">
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || selected.size === 0}
          >
            {initial ? 'Сохранить' : 'Создать'}
          </Button>
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
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(team.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
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
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        {renaming ? (
          <form
            className="flex-1 flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); if (newName.trim()) { onUpdate(team.id, { name: newName.trim() }); setRenaming(false); } }}
          >
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-100 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
            <button type="submit" className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 transition-colors" title="Сохранить">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
            <button type="button" onClick={() => { setNewName(team.name); setRenaming(false); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors" title="Отмена">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1">{team.name}</h2>
            <button
              onClick={() => {
                const next = (team.visibility || 'public') === 'public' ? 'private' : 'public';
                onUpdate(team.id, { visibility: next });
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                (team.visibility || 'public') === 'private'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/25'
              }`}
              title={(team.visibility || 'public') === 'private'
                ? 'Частная команда — нажмите, чтобы сделать публичной'
                : 'Публичная команда — нажмите, чтобы сделать частной'}
            >
              {(team.visibility || 'public') === 'private' ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              )}
              {(team.visibility || 'public') === 'private' ? 'Частная' : 'Публичная'}
            </button>
            <button
              onClick={() => setRenaming(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Переименовать"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
            </button>
          </>
        )}
        <button
          onClick={() => setConfirmDelete(true)}
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-500"
          title="Удалить команду"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card padding="none" className="px-5 py-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{members.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Участников</p>
        </Card>
        <Card padding="none" className="px-5 py-4">
          <p className={`text-2xl font-bold ${avgLoad > 100 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>{avgLoad}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Средняя загрузка</p>
        </Card>
        <Card padding="none" className="px-5 py-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{upcomingVacations}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">В отпуске / планируют</p>
        </Card>
      </div>

      {/* Members table */}
      <Card padding="none" className="overflow-hidden">
        <div className="ui-card-header py-3.5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Состав команды</h3>
          <Button
            onClick={() => setModalOpen(true)}
            size="sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Добавить
          </Button>
        </div>

        {members.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            В команде пока нет участников
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {members.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{initials(emp.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{shortName(emp.name)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{emp.role} · {emp.team}</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <div className="w-20">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{emp.totalAllocation}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${emp.totalAllocation > 100 ? 'bg-red-500' : emp.totalAllocation >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(emp.totalAllocation, 100)}%` }}
                      />
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>
                <button
                  onClick={() => setConfirmRemove(emp)}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0"
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
      </Card>

      <TeamModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddMembers}
        employees={employees.filter((e) => !team.memberIds.includes(e.id))}
        initial={{ name: team.name, memberIds: [] }}
        addOnly
      />

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { onDelete(team.id); onBack(); }}
        title={`Удалить команду «${team.name}»?`}
        message="Команда будет удалена безвозвратно. Это не повлияет на самих сотрудников."
        confirmText="Удалить"
        danger
      />

      <ConfirmModal
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        onConfirm={() => { if (confirmRemove) removeMember(confirmRemove.id); }}
        title={`Убрать ${confirmRemove ? shortName(confirmRemove.name) : ''} из команды?`}
        confirmText="Убрать"
        danger
      />
    </div>
  );
}

/* ── Team Card ── */

function TeamCard({ team, employees, onOpen }) {
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

  const isPrivate = team.visibility === 'private';

  return (
    <div
      onClick={onOpen}
      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Visibility badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
          isPrivate ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
        }`}>
          {isPrivate ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          )}
          {isPrivate ? 'Частная' : 'Публичная'}
        </span>
        <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{team.name}</h3>

      {/* Avatars + metrics row */}
      <div className="flex items-center gap-3 mt-auto">
        <div className="flex items-center -space-x-2 flex-shrink-0">
          {members.slice(0, 4).map((m) => (
            <div key={m.id} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-50 dark:border-gray-800 flex items-center justify-center" title={m.name}>
              <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-300">{initials(m.name)}</span>
            </div>
          ))}
          {members.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/40 border-2 border-gray-50 dark:border-gray-800 flex items-center justify-center">
              <span className="text-[9px] font-semibold text-blue-500 dark:text-blue-400">+{members.length - 4}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ml-auto">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
            </svg>
            {members.length}
          </span>
          <span className={`font-semibold ${avgLoad > 100 ? 'text-red-500' : avgLoad >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
            {avgLoad}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main TeamsView ── */

export default function TeamsView({ employees, onDetailChange }) {
  const { teams, createTeam, updateTeam, deleteTeam } = useTeams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeam, setEditTeam] = useState(null); // team object for editing
  const [detailTeamId, setDetailTeamId] = useState(null);

  const detailTeam = teams.find((t) => t.id === detailTeamId);

  const setDetail = (id) => {
    setDetailTeamId(id);
    onDetailChange?.(!!id);
  };

  const handleSave = (name, memberIds, visibility) => {
    if (editTeam) {
      updateTeam(editTeam.id, { name, memberIds, visibility });
    } else {
      createTeam(name, memberIds, visibility);
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
        onBack={() => setDetail(null)}
        onUpdate={updateTeam}
        onDelete={(id) => { deleteTeam(id); setDetail(null); }}
      />
    );
  }

  // List view
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="ui-section-label">Мои команды</h2>
          {teams.length > 0 && (
            <span className="text-xs text-gray-400">{teams.length}</span>
          )}
        </div>
        <button
          onClick={() => { setEditTeam(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Создать команду
        </button>
      </div>

      {/* Cards — horizontal scroll */}
      {teams.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Команд пока нет</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto py-1 -mx-1 px-1">
          {teams.map((team) => (
            <div key={team.id} className="flex-shrink-0 w-64 sm:w-72">
              <TeamCard
                team={team}
                employees={employees}
                onOpen={() => setDetail(team.id)}
              />
            </div>
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

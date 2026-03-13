import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ep-teams';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function load() {
  if (!canUseStorage()) return [];

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save(teams) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch {
    // Ignore storage failures so the UI keeps working with in-memory state.
  }
}

let idCounter = Date.now();

export default function useTeams() {
  const [teams, setTeams] = useState(load);

  const persist = useCallback((next) => {
    setTeams(next);
    save(next);
  }, []);

  const createTeam = useCallback((name, memberIds, visibility = 'public') => {
    const team = {
      id: `team-${++idCounter}`,
      name,
      memberIds,
      visibility,
      createdAt: new Date().toISOString(),
    };
    const next = [...load(), team];
    persist(next);
    return team;
  }, [persist]);

  const updateTeam = useCallback((id, patch) => {
    const next = load().map((t) => (t.id === id ? { ...t, ...patch } : t));
    persist(next);
  }, [persist]);

  const deleteTeam = useCallback((id) => {
    const next = load().filter((t) => t.id !== id);
    persist(next);
  }, [persist]);

  return { teams, createTeam, updateTeam, deleteTeam };
}

/**
 * The theme: light, dark or the system's, system until the person chooses. The choice is kept in localStorage
 * `setpiece.theme` (falling back to `openfilm.theme`) and shown as
 * `<html data-theme>`; index.html applies it before the first paint, this keeps it current afterwards, in every page
 * of Studio that is open.
 */
import React from 'react';
import { isPreferenceEvent, readPreference, writePreference } from '@/lib/preference-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

const KEY = 'setpiece.theme';
const dark = () => window.matchMedia('(prefers-color-scheme: dark)');

function saved(): ThemeMode {
  const value = readPreference(KEY);
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

function apply(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode === 'system' ? (dark().matches ? 'dark' : 'light') : mode;
}

const listeners = new Set<() => void>();

/* "System" follows the system while Studio is open, not only when it starts */
if (typeof window !== 'undefined') dark().addEventListener('change', () => { if (saved() === 'system') apply('system'); });
/* a theme chosen in another of Studio's pages (another tab of the app, another window) is this one's too */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (!isPreferenceEvent(event.key, KEY)) return;
    apply(saved());
    for (const listener of listeners) listener();
  });
}

export function setThemeMode(mode: ThemeMode) {
  writePreference(KEY, mode);
  apply(mode);
  for (const listener of listeners) listener();
}

/** The chosen theme and a way to change it; every user of it sees the change. */
export function useThemeMode(): [ThemeMode, (mode: ThemeMode) => void] {
  const mode = React.useSyncExternalStore((on) => { listeners.add(on); return () => listeners.delete(on); }, saved, () => 'system' as ThemeMode);
  return [mode, setThemeMode];
}

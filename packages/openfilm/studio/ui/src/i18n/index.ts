/**
 * The UI's words. `t('timeline.split')` looks up a dotted path in the chosen language's table, then in English; a
 * path in neither comes back as itself, so a typo shows on screen instead of an empty label. Placeholders (`{n}`) are
 * filled by the caller.
 *
 * The language is the person's choice in Settings → General, kept in localStorage `setpiece.language` (falling back
 * to `openfilm.language`), or the
 * system's ("system", the default: the first of the browser's languages there is a table for, else English). It is
 * shown as `<html lang>`, which an app embedding Studio reads to match it.
 */
import React from 'react';
import { en } from './en.ts';
import { es } from './es.ts';
import { ja } from './ja.ts';
import { ko } from './ko.ts';
import { zhCN } from './zh-CN.ts';
import { isPreferenceEvent, readPreference, writePreference } from '../lib/preference-storage.ts';

export const LANGUAGES = [
  { code: 'en', name: 'English', words: en },
  { code: 'zh-CN', name: '简体中文', words: zhCN },
  { code: 'ja', name: '日本語', words: ja },
  { code: 'ko', name: '한국어', words: ko },
  { code: 'es', name: 'Español', words: es },
] as const;

export type Language = (typeof LANGUAGES)[number]['code'];
export type LanguageChoice = Language | 'system';

const KEY = 'setpiece.language';

function node(table: unknown, path: string): unknown {
  let cur = table;
  for (const part of path.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) cur = (cur as Record<string, unknown>)[part];
    else return null;
  }
  return cur;
}

function find(table: unknown, path: string): string | null {
  const found = node(table, path);
  return typeof found === 'string' ? found : null;
}

/** Every phrase under `path`, in `language` and in English: what a search through that part of the interface matches. */
export function phrasesUnder(path: string, language: Language = current()): string[] {
  const out: string[] = [];
  const collect = (value: unknown) => {
    if (typeof value === 'string') out.push(value);
    else if (value && typeof value === 'object') for (const v of Object.values(value)) collect(v);
  };
  collect(node(en, path));
  if (language !== 'en') collect(node(LANGUAGES.find((l) => l.code === language)?.words, path));
  return out;
}

/** The language a browser's list asks for, as one of ours: `zh-Hans-CN` and `zh` are 简体中文, `es-MX` is Español. */
export function languageFor(asked: readonly string[]): Language {
  for (const tag of asked) {
    const lower = tag.toLowerCase();
    if (lower.startsWith('zh')) {
      if (/^zh-(hant|tw|hk|mo)\b/.test(lower)) continue;
      return 'zh-CN';
    }
    const base = lower.split('-')[0];
    const found = LANGUAGES.find((l) => l.code === base);
    if (found) return found.code;
  }
  return 'en';
}

function savedChoice(): LanguageChoice {
  const value = readPreference(KEY);
  return LANGUAGES.some((l) => l.code === value) ? value as Language : 'system';
}

function current(): Language {
  const choice = savedChoice();
  if (choice !== 'system') return choice;
  return typeof navigator === 'undefined' ? 'en' : languageFor(navigator.languages?.length ? navigator.languages : [navigator.language]);
}

/** The path in `language`'s table, else in English's, else the path itself. */
export function lookup(path: string, language: Language = current()): string {
  const words = LANGUAGES.find((l) => l.code === language)?.words;
  const text = (words && language !== 'en' ? find(words, path) : null) ?? find(en, path) ?? path;
  const branded = language === 'zh-CN'
    ? text.replaceAll('试界片场', '造境').replaceAll('TryWorld Set', '造境')
    : text.replaceAll('TryWorld Set', 'Setpiece');
  return branded.replaceAll('OPENFILM_NO_UPDATE_CHECK', 'SETPIECE_NO_UPDATE_CHECK');
}

/** The product's name in the language shown: 造境 in Chinese, Setpiece everywhere else. */
export function brandName(language: Language = current()): string {
  return language === 'zh-CN' ? '造境' : 'Setpiece';
}

const listeners = new Set<() => void>();
let shown: Language = current();

function apply() {
  shown = current();
  if (typeof document !== 'undefined') document.documentElement.lang = shown;
  for (const listener of listeners) listener();
}
if (typeof window !== 'undefined') {
  apply();
  window.addEventListener('languagechange', () => { if (savedChoice() === 'system') apply(); });
  /* another tab of Studio changed it */
  window.addEventListener('storage', (e) => { if (isPreferenceEvent(e.key, KEY)) apply(); });
}

export function setLanguageChoice(choice: LanguageChoice) {
  if (choice === 'system') writePreference(KEY, 'system');
  else writePreference(KEY, choice);
  apply();
}

const subscribe = (on: () => void) => { listeners.add(on); return () => { listeners.delete(on); }; };

/** The language shown now; a change draws again whoever uses it. */
export function useLanguage(): Language {
  return React.useSyncExternalStore(subscribe, () => shown, () => 'en' as Language);
}

export function useBrandName(): string {
  return brandName(useLanguage());
}

/** The person's choice (or "system") and a way to change it. */
export function useLanguageChoice(): [LanguageChoice, (choice: LanguageChoice) => void] {
  const choice = React.useSyncExternalStore(subscribe, savedChoice, () => 'system' as LanguageChoice);
  return [choice, setLanguageChoice];
}

/** The translator for the language shown, steady until the language changes. */
export function useT(): (path: string) => string {
  const language = useLanguage();
  return React.useCallback((path: string) => lookup(path, language), [language]);
}

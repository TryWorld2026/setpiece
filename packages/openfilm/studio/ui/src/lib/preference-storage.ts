/**
 * Browser preferences moved from OpenFilm's `openfilm.*` keys to Setpiece's `setpiece.*` keys without losing an
 * existing person's choices. Reads prefer the new key, fall back to the old one, and copy the old value forward on
 * first use. Writes always use the new key. A key may be passed with or without its `openfilm.` / `setpiece.` prefix.
 */
const NEW_PREFIX = 'setpiece.';
const OLD_PREFIX = 'openfilm.';

export function preferenceKey(key: string): string {
  if (key.startsWith(NEW_PREFIX)) return key;
  if (key.startsWith(OLD_PREFIX)) return `${NEW_PREFIX}${key.slice(OLD_PREFIX.length)}`;
  return `${NEW_PREFIX}${key}`;
}

export function legacyPreferenceKey(key: string): string {
  return `${OLD_PREFIX}${preferenceKey(key).slice(NEW_PREFIX.length)}`;
}

function store(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? globalThis.localStorage : globalThis.sessionStorage;
  } catch {
    return null;
  }
}

export function readPreferenceFrom(storage: (Pick<Storage, 'getItem'> & Partial<Pick<Storage, 'setItem'>>) | null | undefined, key: string): string | null {
  if (!storage) return null;
  const current = preferenceKey(key);
  const kept = storage.getItem(current);
  if (kept != null) return kept;
  const old = storage.getItem(legacyPreferenceKey(key));
  if (old == null) return null;
  try { storage.setItem?.(current, old); } catch { /* private mode: still return the old value */ }
  return old;
}

export function writePreferenceTo(storage: Pick<Storage, 'setItem'> | null | undefined, key: string, value: string): void {
  try {
    storage?.setItem(preferenceKey(key), value);
  } catch {
    /* private mode, or a storage that refuses: the caller keeps its in-memory copy */
  }
}

export function removePreferenceFrom(storage: Pick<Storage, 'removeItem'> | null | undefined, key: string): void {
  try {
    storage?.removeItem(preferenceKey(key));
    storage?.removeItem(legacyPreferenceKey(key));
  } catch {
    /* private mode, or a storage that refuses */
  }
}

export function readPreference(key: string, kind: 'local' | 'session' = 'local'): string | null {
  return readPreferenceFrom(store(kind), key);
}

export function writePreference(key: string, value: string, kind: 'local' | 'session' = 'local'): void {
  writePreferenceTo(store(kind), key, value);
}

export function removePreference(key: string, kind: 'local' | 'session' = 'local'): void {
  removePreferenceFrom(store(kind), key);
}

/** Whether a storage event is about this preference, whether another tab wrote the new key or an older one. */
export function isPreferenceEvent(eventKey: string | null, key: string): boolean {
  return eventKey === preferenceKey(key) || eventKey === legacyPreferenceKey(key);
}

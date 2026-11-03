// @ts-check
/**
 * Environment variables across the rename: Setpiece's `SETPIECE_*` names are preferred, and OpenFilm's
 * `OPENFILM_*` names keep working for existing checkouts, scripts and installations.
 */
export function envValue(/** @type {string} */ name) {
  const next = process.env[`SETPIECE_${name}`];
  if (next != null && next !== '') return next;
  return process.env[`OPENFILM_${name}`];
}

export function envFlag(/** @type {string} */ name) {
  return Boolean(envValue(name));
}

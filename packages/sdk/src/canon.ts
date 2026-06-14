import type { JsonLike } from './types';

/**
 * Produces a deterministic, compact canonical JSON string for `value`.
 * Rules (matching Python canonicaljson / RFC 8785):
 *  - Object keys are sorted lexicographically.
 *  - No whitespace around separators.
 *  - Arrays are order-preserving.
 */
export function canonicalJsonString(value: JsonLike): string {
  if (value === null) return 'null';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return '[' + (value as JsonLike[]).map(canonicalJsonString).join(',') + ']';
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => JSON.stringify(k) + ':' + canonicalJsonString(obj[k] as JsonLike));
  return '{' + pairs.join(',') + '}';
}

/** Returns UTF-8 bytes of the canonical JSON encoding of `value`. */
export function canonicalJsonBytes(value: JsonLike): Buffer {
  return Buffer.from(canonicalJsonString(value), 'utf8');
}

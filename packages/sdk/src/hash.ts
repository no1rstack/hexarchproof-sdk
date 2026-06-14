import { createHash } from 'crypto';
import { canonicalJsonBytes } from './canon';
import type { JsonLike } from './types';

/** SHA-256 hex digest of raw bytes. Matches Python hashlib.sha256(raw).hexdigest(). */
export function sha256HexBytes(raw: Buffer | Uint8Array): string {
  return createHash('sha256').update(raw).digest('hex');
}

/** SHA-256 hex digest of a UTF-8 string. */
export function sha256HexString(input: string, encoding: BufferEncoding = 'utf8'): string {
  return createHash('sha256').update(Buffer.from(input, encoding)).digest('hex');
}

/** SHA-256 hex digest of canonical JSON bytes. Matches Python sha256_hex_json exactly. */
export function sha256HexJson(value: JsonLike): string {
  return sha256HexBytes(canonicalJsonBytes(value));
}

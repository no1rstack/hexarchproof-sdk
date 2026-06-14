import { recomputeProofHash } from './proof';
import { sha256HexJson } from './hash';
import type { DRPv1Proof, JsonLike, VerificationResult } from './types';

const HEX64_RE = /^[A-Fa-f0-9]{64}$/;

function isValidDRPShape(candidate: unknown): candidate is DRPv1Proof {
  if (candidate === null || typeof candidate !== 'object' || Array.isArray(candidate)) return false;
  const p = candidate as Record<string, unknown>;
  const anchor = p['anchor'];
  return (
    p['schema_version'] === 'drp.v1' &&
    typeof p['proof_id'] === 'string' && p['proof_id'].length > 0 &&
    typeof p['input_hash'] === 'string' && HEX64_RE.test(p['input_hash']) &&
    typeof p['spec_hash'] === 'string' && HEX64_RE.test(p['spec_hash']) &&
    typeof p['output_hash'] === 'string' && HEX64_RE.test(p['output_hash']) &&
    typeof p['proof_hash'] === 'string' && HEX64_RE.test(p['proof_hash']) &&
    typeof p['timestamp'] === 'string' && p['timestamp'].length > 0 &&
    anchor !== null && typeof anchor === 'object' && !Array.isArray(anchor)
  );
}

/** Verifies a DRPv1Proof against original payloads. Mirrors verify_proof in the Python engine. */
export function verifyProof(
  proof: unknown,
  inputPayload: JsonLike,
  specPayload: JsonLike,
  outputPayload: JsonLike
): VerificationResult {
  const checks = {
    schema_valid: false,
    input_hash_matches: false,
    spec_hash_matches: false,
    output_hash_matches: false,
    proof_hash_matches: false,
  };
  const errors: string[] = [];
  if (!isValidDRPShape(proof)) {
    errors.push('schema_invalid:proof does not match DRPv1Proof shape');
    return { valid: false, checks, errors };
  }
  checks.schema_valid = true;
  checks.input_hash_matches = proof.input_hash === sha256HexJson(inputPayload);
  if (!checks.input_hash_matches) errors.push('input_hash_mismatch');
  checks.spec_hash_matches = proof.spec_hash === sha256HexJson(specPayload);
  if (!checks.spec_hash_matches) errors.push('spec_hash_mismatch');
  checks.output_hash_matches = proof.output_hash === sha256HexJson(outputPayload);
  if (!checks.output_hash_matches) errors.push('output_hash_mismatch');
  checks.proof_hash_matches = proof.proof_hash === recomputeProofHash(proof);
  if (!checks.proof_hash_matches) errors.push('proof_hash_mismatch');
  return { valid: Object.values(checks).every(Boolean), checks, errors };
}

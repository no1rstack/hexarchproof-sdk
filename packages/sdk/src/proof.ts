import { randomUUID } from 'crypto';
import { canonicalJsonBytes } from './canon';
import { sha256HexBytes, sha256HexJson } from './hash';
import type { DRPv1Proof, JsonLike } from './types';

function proofPayloadForHash(proof: Omit<DRPv1Proof, 'proof_hash'> | DRPv1Proof): JsonLike {
  return {
    schema_version: proof.schema_version,
    proof_id: proof.proof_id,
    input_hash: proof.input_hash,
    spec_hash: proof.spec_hash,
    output_hash: proof.output_hash,
    timestamp: proof.timestamp,
  };
}

/** Re-derives proof_hash from canonical payload fields. */
export function recomputeProofHash(proof: DRPv1Proof): string {
  return sha256HexBytes(canonicalJsonBytes(proofPayloadForHash(proof)));
}

/** Builds a fully formed DRPv1Proof. Mirrors build_proof in the Python engine. */
export function buildProof(
  inputPayload: JsonLike,
  specPayload: JsonLike,
  outputPayload: JsonLike,
  network: 'sepolia' = 'sepolia'
): DRPv1Proof {
  const timestamp = new Date().toISOString();
  const partial = {
    schema_version: 'drp.v1' as const,
    proof_id: randomUUID(),
    input_hash: sha256HexJson(inputPayload),
    spec_hash: sha256HexJson(specPayload),
    output_hash: sha256HexJson(outputPayload),
    anchor: { network, tx_hash: null, block_number: null, anchored_at: null },
    timestamp,
  } satisfies Omit<DRPv1Proof, 'proof_hash'>;
  return { ...partial, proof_hash: sha256HexBytes(canonicalJsonBytes(proofPayloadForHash(partial))) };
}

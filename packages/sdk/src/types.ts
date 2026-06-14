/** Any JSON-serialisable value (used as the canonical hash input). */
export type JsonLike =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

/** Blockchain anchor for a proof. Currently scoped to Sepolia testnet. */
export interface DRPv1Anchor {
  network: 'sepolia';
  tx_hash: string | null;
  block_number: number | null;
  anchored_at: string | null;
}

/**
 * A Hexarch Deterministic Reproduction Proof (DRP) document.
 * All hash fields are lowercase hex-encoded SHA-256 digests of canonical JSON.
 * The canonical form follows RFC 8785 key-sort ordering.
 */
export interface DRPv1Proof {
  schema_version: 'drp.v1';
  proof_id: string;
  input_hash: string;
  spec_hash: string;
  output_hash: string;
  proof_hash: string;
  anchor: DRPv1Anchor;
  timestamp: string;
}

/** Result of verifying a DRPv1Proof against its original payloads. */
export interface VerificationResult {
  valid: boolean;
  checks: {
    schema_valid: boolean;
    input_hash_matches: boolean;
    spec_hash_matches: boolean;
    output_hash_matches: boolean;
    proof_hash_matches: boolean;
  };
  errors: string[];
}

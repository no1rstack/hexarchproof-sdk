from __future__ import annotations

import hashlib
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from canonicaljson import encode_canonical_json

JsonLike = dict[str, Any] | list[Any] | str | int | float | bool | None


def canonical_json_bytes(value: JsonLike) -> bytes:
    """RFC 8785 canonical JSON bytes. Identical to TypeScript canonicalJsonBytes."""
    return encode_canonical_json(value)


def canonical_json_string(value: JsonLike) -> str:
    return canonical_json_bytes(value).decode("utf-8")


def sha256_hex_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def sha256_hex_string(input: str, encoding: str = "utf-8") -> str:
    return sha256_hex_bytes(input.encode(encoding))


def sha256_hex_json(value: JsonLike) -> str:
    """SHA-256 hex of canonical JSON bytes. Matches TypeScript sha256HexJson exactly."""
    return sha256_hex_bytes(canonical_json_bytes(value))


def _proof_payload_for_hash(proof: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema_version": proof["schema_version"],
        "proof_id": proof["proof_id"],
        "input_hash": proof["input_hash"],
        "spec_hash": proof["spec_hash"],
        "output_hash": proof["output_hash"],
        "timestamp": proof["timestamp"],
    }


def recompute_proof_hash(proof: dict[str, Any]) -> str:
    return sha256_hex_bytes(canonical_json_bytes(_proof_payload_for_hash(proof)))


def build_proof(
    input_payload: JsonLike,
    spec_payload: JsonLike,
    output_payload: JsonLike,
    network: str = "sepolia",
) -> dict[str, Any]:
    """Build a fully formed DRPv1Proof. Mirrors buildProof in the TypeScript SDK."""
    timestamp = datetime.now(UTC).isoformat()
    proof: dict[str, Any] = {
        "schema_version": "drp.v1",
        "proof_id": str(uuid.uuid4()),
        "input_hash": sha256_hex_json(input_payload),
        "spec_hash": sha256_hex_json(spec_payload),
        "output_hash": sha256_hex_json(output_payload),
        "anchor": {"network": network, "tx_hash": None, "block_number": None, "anchored_at": None},
        "timestamp": timestamp,
    }
    proof["proof_hash"] = recompute_proof_hash(proof)
    return proof


@dataclass(frozen=True)
class VerificationResult:
    valid: bool
    checks: dict[str, bool]
    errors: list[str]


_HEX64_LEN = 64
_HEX_CHARS = frozenset("0123456789abcdefABCDEF")


def _is_hex64(value: Any) -> bool:
    return isinstance(value, str) and len(value) == _HEX64_LEN and all(c in _HEX_CHARS for c in value)


def _is_valid_drp_shape(candidate: Any) -> bool:
    if not isinstance(candidate, dict):
        return False
    anchor = candidate.get("anchor")
    return (
        candidate.get("schema_version") == "drp.v1"
        and isinstance(candidate.get("proof_id"), str)
        and len(candidate.get("proof_id", "")) > 0
        and _is_hex64(candidate.get("input_hash"))
        and _is_hex64(candidate.get("spec_hash"))
        and _is_hex64(candidate.get("output_hash"))
        and _is_hex64(candidate.get("proof_hash"))
        and isinstance(candidate.get("timestamp"), str)
        and len(candidate.get("timestamp", "")) > 0
        and isinstance(anchor, dict)
    )


def verify_proof(
    proof: Any,
    input_payload: JsonLike,
    spec_payload: JsonLike,
    output_payload: JsonLike,
) -> VerificationResult:
    """Verify a DRPv1Proof document against original payloads. Mirrors verifyProof in the TS SDK."""
    checks: dict[str, bool] = {
        "schema_valid": False,
        "input_hash_matches": False,
        "spec_hash_matches": False,
        "output_hash_matches": False,
        "proof_hash_matches": False,
    }
    errors: list[str] = []
    if not _is_valid_drp_shape(proof):
        errors.append("schema_invalid:proof does not match DRPv1Proof shape")
        return VerificationResult(valid=False, checks=checks, errors=errors)
    checks["schema_valid"] = True
    checks["input_hash_matches"] = proof["input_hash"] == sha256_hex_json(input_payload)
    if not checks["input_hash_matches"]: errors.append("input_hash_mismatch")
    checks["spec_hash_matches"] = proof["spec_hash"] == sha256_hex_json(spec_payload)
    if not checks["spec_hash_matches"]: errors.append("spec_hash_mismatch")
    checks["output_hash_matches"] = proof["output_hash"] == sha256_hex_json(output_payload)
    if not checks["output_hash_matches"]: errors.append("output_hash_mismatch")
    checks["proof_hash_matches"] = proof["proof_hash"] == recompute_proof_hash(proof)
    if not checks["proof_hash_matches"]: errors.append("proof_hash_mismatch")
    return VerificationResult(valid=all(checks.values()), checks=checks, errors=errors)


__all__ = [
    "JsonLike", "VerificationResult",
    "canonical_json_bytes", "canonical_json_string",
    "sha256_hex_bytes", "sha256_hex_string", "sha256_hex_json",
    "build_proof", "recompute_proof_hash", "verify_proof",
]

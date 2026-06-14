# @hexarchproof/sdk

TypeScript SDK for **Hexarch Deterministic Reproduction Proofs (DRP)**.

> Execution becomes a verifiable artifact. Same input → same hash → same proof — anchored for independent verification.

## Install

```bash
npm install @hexarchproof/sdk
```

## Usage

```ts
import { buildProof, verifyProof, sha256HexString, sha256HexJson } from '@hexarchproof/sdk';

const hash = sha256HexString('my payload');
const jsonHash = sha256HexJson({ b: 2, a: 1 });

const proof = buildProof(
  { input: 'my deterministic payload' },
  { type: 'hexarch.text-proof', version: '1' },
  { output: 'my deterministic payload' }
);

const result = verifyProof(
  proof,
  { input: 'my deterministic payload' },
  { type: 'hexarch.text-proof', version: '1' },
  { output: 'my deterministic payload' }
);
// result.valid === true
```

## API

- `canonicalJsonString(value)` — RFC 8785 canonical JSON string
- `canonicalJsonBytes(value)` — UTF-8 Buffer of the above
- `sha256HexBytes(raw)` — SHA-256 hex of raw bytes
- `sha256HexString(input)` — SHA-256 hex of a UTF-8 string
- `sha256HexJson(value)` — SHA-256 hex of canonical JSON bytes
- `buildProof(input, spec, output)` — builds a full `DRPv1Proof`
- `recomputeProofHash(proof)` — re-derives `proof_hash` for tamper detection
- `verifyProof(proof, input, spec, output)` — fully verifies a proof document

## Links

- Hexarch Domain: https://hexarch.systems/
- Discord: https://discord.gg/DZysBQJQ

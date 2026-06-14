```
   ██╗  ██╗███████╗██╗  ██╗ █████╗ ██████╗  ██████╗██╗  ██╗    ██████╗ ██████╗  ██████╗  ██████╗ ███████╗    ███████╗██████╗ ██╗  ██╗
   ██║  ██║██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝    ██╔══██╗██╔══██╗██╔═══██╗██╔═══██╗██╔════╝    ██╔════╝██╔══██╗██║ ██╔╝
   ███████║█████╗   ╚███╔╝ ███████║██████╔╝██║     █████╔╝     ██████╔╝██████╔╝██║   ██║██║   ██║█████╗      ███████╗██║  ██║█████╔╝
   ██╔══██║██╔══╝   ██╔██╗ ██╔══██║██╔══██╗██║     ██╔═██╗     ██╔═══╝ ██╔══██╗██║   ██║██║   ██║██╔══╝      ╚════██║██║  ██║██╔═██╗
   ██║  ██║███████╗██╔╝ ██╗██║  ██║██║  ██║╚██████╗██║  ██╗    ██║     ██║  ██║╚██████╔╝╚██████╔╝██║         ███████║██████╔╝██║  ██╗
   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝         ╚══════╝╚═════╝ ╚═╝  ╚═╝
   ██████╗ ██████╗    ██╗   ██╗    ███████╗██████╗ ██╗  ██╗
   ██╔══██╗██╔══██╗   ██║   ██║    ██╔════╝██╔══██╗██║ ██╔╝
   ██║  ██║██████╔╝   ██║   ██║    ███████╗██║  ██║█████╔╝
   ██║  ██║██╔══██╗   ╚██╗ ██╔╝    ╚════██║██║  ██║██╔═██╗
   ██████╔╝██║  ██║    ╚████╔╝     ███████║██████╔╝██║  ██╗
   ╚═════╝ ╚═╝  ╚═╝     ╚═══╝      ╚══════╝╚═════╝ ╚═╝  ╚═╝
   Hexarch Proof SDK | TypeScript + Python | BLI | © Noir Stack LLC 2026
```

# hexarchproof-sdk

Official TypeScript & Python SDK for **Hexarch Deterministic Reproduction Proofs (DRP)**.

Execution becomes a verifiable artifact. Same input produces the same output, the same hash, and the same proof — anchored for independent verification.

## Package listings

- npm: https://www.npmjs.com/package/@hexarchproof/sdk
- PyPI: https://pypi.org/project/hexarchproof-sdk/
- VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=Hexarch.hexarch-domain
- VS Code Publisher: https://marketplace.visualstudio.com/publishers/Hexarch
- Website: https://hexarch.systems/
- Discord Community: https://discord.gg/DZysBQJQ

## Packages

| Package | Language | Description |
|---|---|---|
| [`@hexarchproof/sdk`](./packages/sdk) | TypeScript | Deterministic proof build + verify for Node.js and bundlers |
| [`hexarchproof-sdk`](./packages/python-sdk) | Python | Same algorithms — canonical JSON, SHA-256, DRP v1 |
| [`hexarch-domain`](./packages/vscode-extension) | VS Code Extension | Proof commands in the editor, powered by the TS SDK |

## Build flow

From repository root:

1. Install all workspace dependencies:
   - `npm install`
2. Compile TypeScript SDK:
   - `npm run build:sdk`
3. Compile VS Code extension:
   - `npm run build:extension`
4. Build Python SDK (editable install):
   - `pip install -e packages/python-sdk`
5. Package VS Code extension VSIX:
   - `npm run package:vsix -w packages/vscode-extension`

## Basic usage

### TypeScript

```ts
import { buildProof, verifyProof, sha256HexString, sha256HexJson } from '@hexarchproof/sdk';

// Hash any text deterministically
const hash = sha256HexString('my payload');

// Hash any JSON value with canonical encoding (RFC 8785 key order)
const jsonHash = sha256HexJson({ b: 2, a: 1 }); // same digest as Python sha256_hex_json

// Build a full DRP v1 proof
const proof = buildProof(
  { input: 'my deterministic payload' },          // inputPayload
  { type: 'hexarch.text-proof', version: '1' },  // specPayload
  { output: 'my deterministic payload' }          // outputPayload
);
console.log(proof.schema_version); // 'drp.v1'
console.log(proof.proof_hash);     // sha256 of canonical proof metadata

// Verify the proof later
const result = verifyProof(
  proof,
  { input: 'my deterministic payload' },
  { type: 'hexarch.text-proof', version: '1' },
  { output: 'my deterministic payload' }
);
console.log(result.valid);  // true
```

### Python

```python
from hexarchproof import build_proof, verify_proof, sha256_hex_string, sha256_hex_json

# Hash any text deterministically
hash_val = sha256_hex_string('my payload')

# Hash any JSON value with canonical encoding
json_hash = sha256_hex_json({'b': 2, 'a': 1})  # same digest as TypeScript sha256HexJson

# Build a full DRP v1 proof
proof = build_proof(
    {'input': 'my deterministic payload'},
    {'type': 'hexarch.text-proof', 'version': '1'},
    {'output': 'my deterministic payload'},
)
print(proof['schema_version'])  # 'drp.v1'
print(proof['proof_hash'])      # sha256 of canonical proof metadata

# Verify the proof later
result = verify_proof(
    proof,
    {'input': 'my deterministic payload'},
    {'type': 'hexarch.text-proof', 'version': '1'},
    {'output': 'my deterministic payload'},
)
print(result.valid)   # True
```

## Notes

- TypeScript and Python implementations produce **identical hashes** for the same JSON input. Cross-language verification is fully supported.
- Canonical JSON follows RFC 8785 (lexicographic key sort, no extra whitespace). Zero external dependencies for TypeScript.
- The Python SDK depends only on `canonicaljson` for byte-perfect canonical encoding.
- All hash fields are lowercase hex-encoded SHA-256 digests.
- `proof_hash` covers `schema_version`, `proof_id`, `input_hash`, `spec_hash`, `output_hash`, and `timestamp` — excluding the mutable `anchor` field.

## Support & Discussion

- Issues: https://github.com/no1rstack/hexarchproof-sdk/issues
- Discussions: https://github.com/no1rstack/hexarchproof-sdk/discussions
- Wiki: https://github.com/no1rstack/hexarchproof-sdk/wiki
- Discord Community: https://discord.gg/DZysBQJQ

## CI Publishing

Three workflows are included:

- `.github/workflows/publish-sdk.yml` — publishes `@hexarchproof/sdk` to npm
- `.github/workflows/publish-pypi.yml` — publishes `hexarchproof-sdk` to PyPI
- `.github/workflows/publish-extension.yml` — publishes the VS Code extension to the Marketplace

### Required secrets

For npm: `NPM_TOKEN`

For PyPI: `PYPI_API_TOKEN` (token fallback), optionally trusted publisher

For VS Code Marketplace: `VSCE_PAT`

## License

This project is licensed under the **Business License Integration (BLI)**.

See [LICENSE](./LICENSE) for details.

---

© 2026 **Noir Stack LLC**. All rights reserved.

[hexarch.systems](https://hexarch.systems/) · [noirstack.com](https://noirstack.com) · [Discord](https://discord.gg/DZysBQJQ) · [LinkedIn](https://www.linkedin.com/company/113360045/)

# hexarchproof-sdk (Python)

Python SDK for **Hexarch Deterministic Reproduction Proofs (DRP)**.

> Same input → same hash → same proof — anchored for independent verification.

## Install

```bash
pip install hexarchproof-sdk
```

## Usage

```python
from hexarchproof import build_proof, verify_proof, sha256_hex_string, sha256_hex_json

hash_val = sha256_hex_string('my payload')
json_hash = sha256_hex_json({'b': 2, 'a': 1})

proof = build_proof(
    {'input': 'my deterministic payload'},
    {'type': 'hexarch.text-proof', 'version': '1'},
    {'output': 'my deterministic payload'},
)
# proof['schema_version'] == 'drp.v1'

result = verify_proof(
    proof,
    {'input': 'my deterministic payload'},
    {'type': 'hexarch.text-proof', 'version': '1'},
    {'output': 'my deterministic payload'},
)
# result.valid == True
```

## Links

- Hexarch Domain: https://hexarch.systems/
- Discord: https://discord.gg/DZysBQJQ

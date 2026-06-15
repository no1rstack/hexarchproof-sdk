# Hexarch Domain (VS Code Extension)

Execution becomes a verifiable artifact.

Same input produces the same output, the same hash, and the same proof — anchored for independent verification.

## Features

- **Hexarch: Show Verification Promise** — information message about deterministic guarantees
- **Hexarch: Hash Input (SHA-256)** — hashes selected text / document / manual input and copies to clipboard
- **Hexarch: Generate Deterministic Proof** — builds a full DRP v1 JSON proof from your text
- **Hexarch: Verify Deterministic Proof** — validates a proof JSON document against its original input

All commands use [`@hexarchproof/sdk`](https://www.npmjs.com/package/@hexarchproof/sdk).

## Commands

| Command | Description |
|---|---|
| `Hexarch: Show Verification Promise` | Displays the Hexarch verification guarantee |
| `Hexarch: Hash Input (SHA-256)` | SHA-256 hash of selection / document / input |
| `Hexarch: Generate Deterministic Proof` | Creates a `drp.v1` JSON proof |
| `Hexarch: Verify Deterministic Proof` | Verifies a `drp.v1` JSON proof |

## Links

- Hexarch Domain: https://hexarch.systems/
- Company: https://noirstack.com
- Support: https://github.com/no1rstack/hexarchproof-sdk/issues
- GitHub: https://github.com/no1rstack/hexarchproof-sdk
- LinkedIn: https://www.linkedin.com/company/113360045/

## Publishing

From repository root:

1. Install dependencies: `npm install`
2. Compile extension: `npm run build:extension`
3. Package VSIX: `npm run package -w packages/vscode-extension`

To publish with the configured Marketplace publisher:

- `npm run publish -w packages/vscode-extension`

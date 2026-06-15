import * as vscode from 'vscode';
import { buildProof, sha256HexString, verifyProof, type JsonLike } from '@noirstack/hexarchproof-sdk';

const TEXT_SPEC: JsonLike = { type: 'hexarch.text-proof', version: '1', encoding: 'utf8' };

function getSelectedOrWholeText(editor: vscode.TextEditor): string {
  return editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);
}

async function resolveInput(): Promise<string | undefined> {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const text = getSelectedOrWholeText(editor);
    if (text.length > 0) return text;
  }
  return vscode.window.showInputBox({ prompt: 'Enter text to hash / prove', placeHolder: 'Hexarch input payload', ignoreFocusOut: true });
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('hexarchDomain.showDeterminismMessage', async () => {
      await vscode.window.showInformationMessage('Hexarch Domain: execution becomes a verifiable artifact — deterministic input, deterministic output, deterministic proof.');
    }),
    vscode.commands.registerCommand('hexarchDomain.hashInput', async () => {
      const input = await resolveInput();
      if (input === undefined) return;
      const hash = sha256HexString(input);
      await vscode.env.clipboard.writeText(hash);
      await vscode.window.showInformationMessage(`SHA-256 hash copied to clipboard: ${hash.slice(0, 16)}…`);
    }),
    vscode.commands.registerCommand('hexarchDomain.generateProof', async () => {
      const input = await resolveInput();
      if (input === undefined) return;
      const proof = buildProof(input, TEXT_SPEC, input);
      const doc = await vscode.workspace.openTextDocument({ content: JSON.stringify(proof, null, 2), language: 'json' });
      await vscode.window.showTextDocument(doc, { preview: false });
      await vscode.window.showInformationMessage('Hexarch DRP v1 proof generated in a new JSON document.');
    }),
    vscode.commands.registerCommand('hexarchDomain.verifyProof', async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        await vscode.window.showWarningMessage('Open a Hexarch proof JSON document then run this command again.');
        return;
      }
      let candidate: unknown;
      try { candidate = JSON.parse(activeEditor.document.getText()); } catch {
        await vscode.window.showErrorMessage('Current document is not valid JSON.');
        return;
      }
      const originalInput = await vscode.window.showInputBox({ prompt: 'Enter the original input text to verify against this proof', placeHolder: 'Original payload text', ignoreFocusOut: true });
      if (originalInput === undefined) return;
      const result = verifyProof(candidate, originalInput, TEXT_SPEC, originalInput);
      if (result.valid) {
        await vscode.window.showInformationMessage('Hexarch proof verified: all checks passed.');
      } else {
        await vscode.window.showErrorMessage(`Proof verification failed: ${result.errors.join(', ')}`);
      }
    })
  );
}

export function deactivate(): void {}

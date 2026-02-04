import * as vscode from 'vscode';
import { Linter } from 'gt-lint';
import type { LintMessage, Fix } from 'gt-lint';
import { getConfigForDocument } from './configuration';

export class GTLintCodeActionProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

  async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    _token: vscode.CancellationToken
  ): Promise<vscode.CodeAction[]> {
    const { linter: linterConfig, settings } = await getConfigForDocument(document);

    if (!settings.enable) {
      return [];
    }

    // Get lint results to find fixes
    const source = document.getText();
    const linter = new Linter(linterConfig);
    const result = linter.lint(source, document.uri.fsPath);

    const actions: vscode.CodeAction[] = [];

    // Find messages that overlap with the requested range and have fixes
    for (const message of result.messages) {
      if (!message.fix) {
        continue;
      }

      // Check if this message is within the requested range
      const messageRange = this.getMessageRange(message, document);
      if (!messageRange.intersection(range)) {
        continue;
      }

      // Create a quick fix action
      const action = this.createQuickFix(document, message, message.fix);
      actions.push(action);
    }

    // Also check for diagnostics from the context (in case our cached results are stale)
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source !== 'gtlint') {
        continue;
      }

      // Find the corresponding message with fix
      const message = result.messages.find(
        (m) =>
          m.ruleId === diagnostic.code &&
          m.line - 1 === diagnostic.range.start.line &&
          m.fix
      );

      if (message?.fix) {
        // Check we haven't already added this fix
        const alreadyAdded = actions.some(
          (a) =>
            a.title === `Fix: ${message.message}` ||
            a.title === this.getFixTitle(message)
        );
        if (!alreadyAdded) {
          const action = this.createQuickFix(document, message, message.fix);
          action.diagnostics = [diagnostic];
          actions.push(action);
        }
      }
    }

    return actions;
  }

  private getMessageRange(message: LintMessage, document: vscode.TextDocument): vscode.Range {
    const startLine = Math.max(0, message.line - 1);
    const startColumn = message.column;
    const endLine = message.endLine !== undefined ? Math.max(0, message.endLine - 1) : startLine;
    const endColumn = message.endColumn !== undefined ? message.endColumn : startColumn + 1;

    return new vscode.Range(
      new vscode.Position(startLine, startColumn),
      new vscode.Position(endLine, endColumn)
    );
  }

  private getFixTitle(message: LintMessage): string {
    // Create a user-friendly title based on the rule
    switch (message.ruleId) {
      case 'no-undefined-vars':
        return `Define variable mentioned in error`;
      case 'indent-style':
        return `Fix indentation`;
      case 'no-unclosed-string':
        return `Close string`;
      case 'no-unclosed-bracket':
        return `Close bracket`;
      default:
        return `Fix: ${message.message}`;
    }
  }

  private createQuickFix(
    document: vscode.TextDocument,
    message: LintMessage,
    fix: Fix
  ): vscode.CodeAction {
    const title = this.getFixTitle(message);
    const action = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);

    // Convert fix range (character offsets) to VSCode range
    const startPos = document.positionAt(fix.range[0]);
    const endPos = document.positionAt(fix.range[1]);
    const range = new vscode.Range(startPos, endPos);

    // Create the edit
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, fix.text);
    action.edit = edit;

    // Mark as preferred if it's the only fix for this diagnostic
    action.isPreferred = true;

    return action;
  }
}
